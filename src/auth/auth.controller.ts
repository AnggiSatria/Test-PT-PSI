import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type {
  requestBodyLogin,
  requestBodyRegister,
} from './types/register.types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
