import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ScrymeService } from "../scryme/scryme.service";
import * as bcrypt from "bcrypt";
import { randomBytes } from "crypto";

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
    role?: "ADMIN" | "STAFF" | "CLIENT";
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException("A user with this email already exists");
    }

    if (dto.role && dto.role !== "CLIENT") {
      throw new BadRequestException("Only customer signup is allowed");
    }

    const hashedPassword = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : null;
    const resolvedRole = "CLIENT";

    // 1. Heavy lifting on Scryme side (only customer/client)
    try {
      await this.scrymeService.registerCustomer({
        name: dto.name,
        email: dto.email.toLowerCase(),
      });
    } catch (error: any) {
      // Log and propagate/handle Scryme errors to fulfill requirements
      throw new BadRequestException(
        `Failed to register user in Scryme: ${error.message}`,
      );
    }

    // 2. Local fallback persistence to allow standard app session management and local DB relations
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        role: resolvedRole,
        accounts: dto.password
          ? {
              create: {
                accountId: dto.email.toLowerCase(),
                providerId: "credential",
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
   * Only allows customers/clients to authenticate.
   */
  async signIn(dto: { email: string; password?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { accounts: true },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (user.role !== "CLIENT") {
      throw new UnauthorizedException(
        "Access denied: only customer authentication is allowed",
      );
    }

    if (dto.password) {
      const passwordAccount = user.accounts.find(
        (acc) => acc.providerId === "credential",
      );
      if (!passwordAccount || !passwordAccount.password) {
        throw new UnauthorizedException("Invalid email or password");
      }

      const isMatch = await bcrypt.compare(
        dto.password,
        passwordAccount.password,
      );
      if (!isMatch) {
        throw new UnauthorizedException("Invalid email or password");
      }
    }

    // Create a new session matching Better Auth specs
    const token = randomBytes(32).toString("hex");
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
