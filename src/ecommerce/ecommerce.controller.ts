import { Body, Controller, Post } from '@nestjs/common';
import { EcommerceService } from './ecommerce.service';
import type { requestBodyCheckout } from './types/checkout.interfaces';

@Controller('checkout')
export class EcommerceController {
  constructor(private ecommerceService: EcommerceService) {}

  @Post()
  async checkout(@Body() body: requestBodyCheckout) {
    return this.ecommerceService.checkout({
      userId: body.userId,
      price: body.price,
      voucherCode: body.voucherCode,
    });
  }
}
