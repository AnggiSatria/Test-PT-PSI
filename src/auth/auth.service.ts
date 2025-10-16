import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type {
  requestBodyLogin,
  requestBodyRegister,
} from './types/register.types';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

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
