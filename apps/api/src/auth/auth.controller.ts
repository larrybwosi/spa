import { Controller, Post, Get, Body, Req, Res, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: { name: string; email: string; password?: string; role?: 'ADMIN' | 'STAFF' | 'CLIENT' }) {
    return this.authService.signUp(body);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() body: { email: string; password?: string },
    @Res({ passthrough: true }) response: any,
  ) {
    const res = response as Response;
    const result = await this.authService.signIn(body);

    // Set a HTTP-only cookie matching Better Auth session-token storage
    res.cookie('better-auth.session-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: result.session.expiresAt,
    });

    return result;
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signOut(@Req() request: any, @Res({ passthrough: true }) response: any) {
    const req = request as Request;
    const res = response as Response;
    const token = this.extractToken(req);
    if (token) {
      await this.authService.signOut(token);
    }

    // Clear cookies
    res.clearCookie('better-auth.session-token');
    return { success: true };
  }

  @Get('session')
  async getSession(@Req() request: any) {
    const req = request as Request;
    const token = this.extractToken(req);
    if (!token) {
      throw new UnauthorizedException('No active session found');
    }

    const user = await this.authService.validateSession(token);
    if (!user) {
      throw new UnauthorizedException('Session expired or invalid');
    }

    return { user };
  }

  private extractToken(request: Request): string | null {
    // 1. Try Authorization header
    const authHeader = request.headers.authorization;
    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
        return parts[1];
      }
      return parts[0]; // fallback if they just send the raw token string
    }

    // 2. Try Cookie header (express cookies might be parsed in request.cookies or we parse request.headers.cookie manually)
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
