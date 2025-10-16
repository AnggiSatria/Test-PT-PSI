import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { requestHeader } from './types/users.types';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers(params: requestHeader): Promise<User[]> {
    const where: any = {};
    if (params.id) where.id = params.id;
    if (params.email) where.email = params.email;
    if (params.name) where.name = params.name;
    if (params.telp) where.telp = params.telp;
    if (params.points !== undefined) where.points = params.points;

    return this.prisma.user.findMany({ where });
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');
    return user;
  }
}
