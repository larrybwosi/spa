import { Injectable, BadRequestException } from '@nestjs/common';
import { ScrymeService } from '../scryme/scryme.service';
import { OrdersService } from '../orders/orders.service';
import { User } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(
    private readonly scrymeService: ScrymeService,
    private readonly ordersService: OrdersService,
  ) {}

  async getCart(user: User) {
    return this.scrymeService.getCart(user.id);
  }

  async clearCart(user: User) {
    return this.scrymeService.clearCart(user.id);
  }

  async addToCart(
    user: User,
    dto: {
      productId?: string;
      variantId?: string;
      serviceId?: string;
      bookingDetails?: any;
      quantity: number;
    },
  ) {
    const payload = {
      ...dto,
      sessionId: user.id,
      customerId: user.id,
    };
    return this.scrymeService.addToCart(payload);
  }

  async removeFromCart(
    user: User,
    dto: {
      productId?: string;
      variantId?: string;
      serviceId?: string;
    },
  ) {
    const payload = {
      ...dto,
      sessionId: user.id,
      customerId: user.id,
    };
    return this.scrymeService.removeFromCart(payload);
  }

  async checkout(user: User) {
    const cart = await this.getCart(user);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const items = cart.items.map((item: any) => {
      const productId = item.productId || item.variantId;
      if (!productId) {
        throw new BadRequestException('Cart item does not contain a product ID');
      }
      return {
        productId,
        quantity: item.quantity,
      };
    });

    const order = await this.ordersService.create(user, { items });
    await this.clearCart(user);
    return order;
  }
}
