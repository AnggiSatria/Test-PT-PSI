import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Cannot find API documentation. Please refer to the README.md file for setup instructions.';
  }
}
