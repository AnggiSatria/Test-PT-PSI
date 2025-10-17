import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type {
  requestBodyLogin,
  requestBodyRegister,
} from './types/register.types';
import { AuthGuard } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // initiates the OAuth2 flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const userProfile = (req.user as any).profile;
    const user = await this.authService.findOrCreateUserFromGoogle(userProfile);
    const token = await this.authService.getJwtForUser(user);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    const redirectUrl =
      process.env.FRONTEND_AFTER_LOGIN || 'http://localhost:3000';
    return res.redirect(redirectUrl);
  }

  @Get('me')
  async me(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['jwt'];
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    try {
      const jwt = require('jsonwebtoken');
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET || 'CHANGE_THIS_SECRET',
      );
      await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      return res.json();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt');
    return res.json();
  }

  @Post('register')
  async register(@Body() body: requestBodyRegister) {
    try {
      const user = await this.authService.register(body);
      return { message: 'User created successfully', data: user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  async login(@Body() body: requestBodyLogin) {
    const user = await this.authService.login(body);
    return { message: 'Login successful', data: user };
  }
}
