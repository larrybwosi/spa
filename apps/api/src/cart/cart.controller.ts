import { Controller, Get, Post, Delete, Body, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { BetterAuthGuard } from '../auth/better-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('cart')
@UseGuards(BetterAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() user: any) {
    return this.cartService.getCart(user);
  }

  @Delete()
  async clearCart(@CurrentUser() user: any) {
    return this.cartService.clearCart(user);
  }

  @Post('items')
  async addToCart(
    @CurrentUser() user: any,
    @Body()
    body: {
      productId?: string;
      variantId?: string;
      serviceId?: string;
      bookingDetails?: any;
      quantity: number;
    },
  ) {
    return this.cartService.addToCart(user, body);
  }

  @Delete('items')
  async removeFromCart(
    @CurrentUser() user: any,
    @Body()
    body: {
      productId?: string;
      variantId?: string;
      serviceId?: string;
    },
  ) {
    return this.cartService.removeFromCart(user, body);
  }

  @Post('checkout')
  async checkout(@CurrentUser() user: any) {
    return this.cartService.checkout(user);
  }
}
