import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { requestBodyCheckout } from './types/checkout.interfaces';

@Injectable()
export class EcommerceService {
  constructor(private prisma: PrismaService) {}

  async checkout({ userId, price, voucherCode }: requestBodyCheckout) {
    let discountValue = 0;
    let finalPrice = price;
    let point = 0;

    if (voucherCode) {
      const voucher = await this.prisma.voucher.findUnique({
        where: { code: voucherCode },
      });

      if (!voucherCode) {
        throw new Error('Voucher not found');
      }

      discountValue = !voucher ? price * 1 : price * voucher.discount;
      finalPrice = price - discountValue;
      point = discountValue * 0.02;
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        totalPrice: price,
        discountValue,
        pointsEarned: point,
        finalPrice,
      },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { points: { increment: Math.round(point) } },
    });

    return { message: 'Checkout success', transaction };
  }
}
