import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import type { requestHeader, responseBody } from './types/users.types';
import { User } from '@prisma/client';

@Controller('user')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get(`/s`)
  async findAllUsers(
    @Query() params: requestHeader,
  ): Promise<responseBody<User[]>> {
    const users = await this.users.findAllUsers(params);
    return { message: 'Success', data: users };
  }

  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<responseBody<User>> {
    const user = await this.users.findUserById(id);
    return { message: 'Success', data: user };
  }
}
