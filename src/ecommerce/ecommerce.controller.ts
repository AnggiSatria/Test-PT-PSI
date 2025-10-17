import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EcommerceService } from './ecommerce.service';
import type {
  reqParamsTransaction,
  requestBodyCheckout,
  requestBodyVoucher,
} from './types/checkout.interfaces';

@Controller('ecommerce')
export class EcommerceController {
  constructor(private ecommerceService: EcommerceService) {}

  @Post('checkout')
  async checkout(@Body() body: requestBodyCheckout) {
    return this.ecommerceService.checkout({
      userId: body.userId,
      price: body.price,
      voucherCode: body.voucherCode,
    });
  }

  @Post('voucher')
  async createVoucher(@Body() body: requestBodyVoucher) {
    return this.ecommerceService.createVoucher(body);
  }

  @Get('data-transactions')
  async getAllTransactions(@Query() query: reqParamsTransaction) {
    return this.ecommerceService.getAllTransactions(query);
  }
}
