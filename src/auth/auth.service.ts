import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type {
  requestBodyLogin,
  requestBodyRegister,
} from './types/register.types';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async findOrCreateUserFromGoogle(profile: any) {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName || profile.name?.givenName || 'Unnamed';

    let user = null;
    if (email) {
      user = await this.prisma.user.findUnique({ where: { email } });
    }

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: randomBytes(16).toString('hex'),
        },
      });
    }

    return user;
  }

  async getJwtForUser(user: any) {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }

  async register(body: requestBodyRegister) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existingUser) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        telp: body.telp,
        points: body.points ?? 0,
      },
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.TOKEN_KEY || 'default_secret',
      { expiresIn: '7d' },
    );

    await this.prisma.user.update({
      where: { id: newUser.id },
      data: { token },
    });

    return { ...newUser, token };
  }

  async login(body: requestBodyLogin) {
    const userExist = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!userExist) throw new BadRequestException('Email not found');

    const isValid = await bcrypt.compare(body.password, userExist.password);
    if (!isValid) throw new BadRequestException('Password is incorrect');

    return { ...userExist };
  }
}
