import {
  Injectable,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { ScrymeService } from "@/integrations/scryme/scryme.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private scrymeService: ScrymeService,
  ) {}

  /**
   * Standard signup endpoint. Creates a User and associated Password Account in database.
   * Delegates the actual customer registration heavy-lifting to Scryme API.
   * Staff/Admin registration is completely disallowed.
   */
  async signUp(dto: {
    name: string;
    email: string;
    password?: string;
    role?: any;
  }) {
    // Check if user already exists locally
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException("Email already registered");
    }

    // 1. Heavy lifting on Scryme side (only customer/client)
    try {
      await this.scrymeService.api.customer.auth.signUp({
        name: dto.name,
        email: dto.email.toLowerCase(),
        password: dto.password,
      });
    } catch (error: any) {
      // Log and propagate/handle Scryme errors to fulfill requirements
      throw new BadRequestException(
        `Failed to register user in Scryme: ${error.message}`,
      );
    }

    // 2. Create User and Account locally
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        role: "CLIENT",
      },
    });

    if (dto.password) {
      await this.prisma.account.create({
        data: {
          accountId: user.id,
          providerId: "credentials",
          userId: user.id,
          password: dto.password,
        },
      });
    }

    return user;
  }

  /**
   * Standard signin endpoint. Validates credentials, creates a session in db, and returns token + session.
   * Only allows customers/clients to authenticate.
   */
  async signIn(dto: { email: string; password?: string }) {
    // 1. Remote sign in
    const result = await this.scrymeService.api.customer.auth.signIn({
      email: dto.email,
      password: dto.password,
    });

    // 2. Local session creation if successful
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const token = result.token || "mock-token";
    const expiresAt = result.session?.expiresAt
      ? new Date(result.session.expiresAt)
      : new Date(Date.now() + 60 * 60 * 1000);

    const session = await this.prisma.session.create({
      data: {
        token,
        expiresAt,
        userId: user.id,
      },
    });

    return {
      token,
      user,
      session,
    };
  }

  /**
   * Validate a session token. Reads session from database, checks expiry, and returns user if valid.
   * Only returns the user if they are a customer (CLIENT).
   */
  async validateSession(token: string) {
    const session = await this.prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      return null;
    }

    if (session.user.role !== "CLIENT") {
      return null;
    }

    if (new Date() > session.expiresAt) {
      // Clean up expired session
      await this.prisma.session
        .delete({ where: { id: session.id } })
        .catch(() => {});
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
