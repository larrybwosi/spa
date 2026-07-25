import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';

@Injectable()
export class BetterAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<any>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication session token is missing');
    }

    const user = await this.authService.validateSession(token);
    if (!user) {
      throw new UnauthorizedException('Session is invalid or has expired');
    }

    // Attach user to the request object for controllers to use
    request.user = user;
    return true;
  }

  private extractToken(request: Request): string | null {
    // 1. Try Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
        return parts[1];
      }
      return parts[0]; // raw token
    }

    // 2. Try Cookie
    if (request.cookies && request.cookies['better-auth.session-token']) {
      return request.cookies['better-auth.session-token'];
    }

    const rawCookies = request.headers.cookie;
    if (rawCookies) {
      const match = rawCookies.match(/better-auth\.session-token=([^;]+)/);
      if (match) {
        return match[1];
      }
    }

    return null;
  }
}
