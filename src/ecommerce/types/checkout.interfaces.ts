export interface requestBodyCheckout {
  userId: string;
  price: number;
  voucherCode?: string;
}

export interface reqParamsTransaction {
  userId: string;
  totalPrice: number;
  discountValue: number;
  pointsEarned: number;
  finalPrice: number;
}

export interface requestBodyVoucher {
  code: string;
  discount: number;
}
