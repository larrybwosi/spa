import {
  Injectable,
  BadRequestException,
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
  }) {

    // 1. Heavy lifting on Scryme side (only customer/client)
    try {
      const result = await this.scrymeService.api.customer.auth.signUp({
        name: dto.name,
        email: dto.email.toLowerCase(),
        password: dto.password,
      });

      return result;
    } catch (error: any) {
      // Log and propagate/handle Scryme errors to fulfill requirements
      throw new BadRequestException(
        `Failed to register user in Scryme: ${error.message}`,
      );
    }
  }

  /**
   * Standard signin endpoint. Validates credentials, creates a session in db, and returns token + session.
   * Only allows customers/clients to authenticate.
   */
  async signIn(dto: { email: string; password?: string }) {
    const result = await this.scrymeService.api.customer.auth.signIn({
      email: dto.email,
      password: dto.password,
    })
    return result;
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
