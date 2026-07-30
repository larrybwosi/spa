import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { BetterAuthGuard } from "../auth/better-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";

@Controller("orders")
@UseGuards(BetterAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  async getAll(@CurrentUser() user: any) {
    return this.ordersService.getAll(user);
  }

  @Get(":id")
  async getOne(@Param("id") id: string, @CurrentUser() user: any) {
    return this.ordersService.getOne(id, user);
  }

  @Post()
  async create(
    @CurrentUser() user: any,
    @Body()
    body: {
      clientId?: string;
      items: { productId: string; quantity: number }[];
    },
  ) {
    return this.ordersService.create(user, body);
  }
}
