import { Injectable } from "@nestjs/common";
import { ScrymeBaseService } from "./scryme-base.service";
import { ScrymeServerSDK } from "@scryme/sdk/server";

@Injectable()
export class ScrymeCustomersService {
  constructor(private readonly base: ScrymeBaseService) {}

  async registerCustomer(
    dto: Parameters<ScrymeServerSDK["admin"]["registerCustomer"]>[0],
  ): Promise<any> {
    return this.base.execute<any>(
      "/v3/{orgSlug}/customers/register",
      () => this.base.scrymeServer.admin.registerCustomer(dto),
      true,
    );
  }

  async listCustomers(): Promise<any[]> {
    return this.base.execute<any[]>(
      "/v3/{orgSlug}/customers",
      () => this.base.scrymeServer.admin.getCustomers() as any,
      false,
    );
  }

  async getCustomer(id: string): Promise<any> {
    return this.base.execute<any>(
      `/v3/{orgSlug}/customers/${id}`,
      () => this.base.scrymeServer.admin.getCustomerById(id) as any,
      false,
    );
  }

  async updateCustomer(
    id: string,
    dto: Parameters<ScrymeServerSDK["admin"]["updateCustomer"]>[1],
  ): Promise<any> {
    return this.base.execute<any>(
      `/v3/{orgSlug}/customers/${id}`,
      () => this.base.scrymeServer.admin.updateCustomer(id, dto),
      true,
    );
  }

  async deleteCustomer(id: string): Promise<any> {
    return this.base.execute<any>(
      `/v3/{orgSlug}/customers/${id}`,
      () => this.base.scrymeServer.admin.deleteCustomer(id),
      true,
    );
  }
}
