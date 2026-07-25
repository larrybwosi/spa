import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  /**
   * Standard signup endpoint. Creates a User and associated Password Account in database.
   */
  async signUp(dto: { name: string; email: string; password?: string; role?: 'ADMIN' | 'STAFF' | 'CLIENT' }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const hashedPassword = dto.password ? await bcrypt.hash(dto.password, 10) : null;

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        role: dto.role || 'CLIENT',
        accounts: dto.password
          ? {
              create: {
                accountId: dto.email.toLowerCase(),
                providerId: 'credential',
                password: hashedPassword,
              },
            }
          : undefined,
      },
    });

    return user;
  }

  /**
   * Standard signin endpoint. Validates credentials, creates a session in db, and returns token + session.
   */
  async signIn(dto: { email: string; password?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { accounts: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (dto.password) {
      const passwordAccount = user.accounts.find((acc) => acc.providerId === 'credential');
      if (!passwordAccount || !passwordAccount.password) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(dto.password, passwordAccount.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }
    }

    // Create a new session matching Better Auth specs
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days session lifetime

    const session = await this.prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
      include: {
        user: true,
      },
    });

    return {
      token,
      session,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Validate a session token. Reads session from database, checks expiry, and returns user if valid.
   */
  async validateSession(token: string) {
    const session = await this.prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      return null;
    }

    if (new Date() > session.expiresAt) {
      // Clean up expired session
      await this.prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    return session.user;
  }

  /**
   * Standard signout endpoint. Deletes the active session from DB.
   */
  async signOut(token: string) {
    await this.prisma.session.deleteMany({
      where: { token },
    });
    return { success: true };
  }
}
