import { Injectable } from "@nestjs/common";
import { ScrymeBaseService } from "./scryme-base.service";
import { ScrymeServerSDK } from "@scryme/sdk/server";

@Injectable()
export class ScrymeOrdersService {
  constructor(private readonly base: ScrymeBaseService) {}

  async createOrder(
    dto: Parameters<ScrymeServerSDK["orders"]["createOrder"]>[0],
  ): Promise<any> {
    return this.base.execute<any>(
      "/v3/{orgSlug}/orders",
      () => this.base.scrymeServer.orders.createOrder(dto),
      true,
    );
  }

  async listOrders(): Promise<any[]> {
    return this.base.execute<any[]>(
      "/v3/{orgSlug}/orders",
      () => this.base.scrymeServer.orders.getOrders() as any,
      false,
    );
  }

  async updateOrderStatus(
    id: string,
    dto: Parameters<ScrymeServerSDK["orders"]["updateStatus"]>[1],
  ): Promise<any> {
    return this.base.execute<any>(
      `/v3/{orgSlug}/orders/${id}/status`,
      () => this.base.scrymeServer.orders.updateStatus(id, dto),
      true,
    );
  }
}
