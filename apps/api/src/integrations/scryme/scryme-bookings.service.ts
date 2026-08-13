import { Injectable } from "@nestjs/common";
import { ScrymeBaseService } from "./scryme-base.service";
import { ScrymeServerSDK } from "@scryme/sdk/server";

@Injectable()
export class ScrymeBookingsService {
  constructor(private readonly base: ScrymeBaseService) {}

  async createBooking(
    dto: Parameters<ScrymeServerSDK["catalog"]["createBooking"]>[0],
  ): Promise<any> {
    return this.base.execute<any>(
      "/v3/{orgSlug}/services/bookings",
      () => this.base.scrymeServer.catalog.createBooking(dto),
      true,
    );
  }

  async listBookings(): Promise<any[]> {
    return this.base.execute<any[]>(
      "/v3/{orgSlug}/services/bookings",
      () => this.base.scrymeServer.catalog.getBookings() as any,
      false,
    );
  }

  async getBooking(id: string): Promise<any> {
    return this.base.execute<any>(
      `/v3/{orgSlug}/services/bookings/${id}`,
      () => this.base.scrymeServer.catalog.getBooking(id) as any,
      false,
    );
  }

  async updateBookingStatus(
    id: string,
    dto: Parameters<ScrymeServerSDK["catalog"]["updateBookingStatus"]>[1],
  ): Promise<any> {
    return this.base.execute<any>(
      `/v3/{orgSlug}/services/bookings/${id}/status`,
      () => this.base.scrymeServer.catalog.updateBookingStatus(id, dto),
      true,
    );
  }

  async completeBooking(
    id: string,
    dto: Parameters<ScrymeServerSDK["catalog"]["completeBooking"]>[1],
  ): Promise<any> {
    return this.base.execute<any>(
      `/v3/{orgSlug}/services/bookings/${id}/complete`,
      () => this.base.scrymeServer.catalog.completeBooking(id, dto),
      true,
    );
  }
}
