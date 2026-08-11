import { Injectable } from "@nestjs/common";
import { ScrymeBaseService } from "./scryme-base.service";
import { ScrymeServerSDK } from "@scryme/sdk/server";

@Injectable()
export class ScrymeShiftsService {
  constructor(private readonly base: ScrymeBaseService) {}

  async createShift(
    memberId: string,
    dto: Omit<
      Parameters<ScrymeServerSDK["catalog"]["createShift"]>[1],
      "dayOfWeek"
    > & { startTime: string },
  ): Promise<any> {
    const dayOfWeek = isNaN(new Date(dto.startTime).getTime())
      ? 1
      : new Date(dto.startTime).getDay();

    return this.base.execute<any>(
      `/v3/{orgSlug}/services/staff/${memberId}/shifts`,
      () =>
        this.base.scrymeServer.catalog.createShift(memberId, {
          ...dto,
          dayOfWeek,
        }),
      true,
    );
  }

  async getStaffShifts(memberId: string): Promise<any[]> {
    return this.base.execute<any[]>(
      `/v3/{orgSlug}/services/staff/${memberId}/shifts`,
      () => this.base.scrymeServer.catalog.getStaffShifts(memberId) as any,
      false,
    );
  }

  async addBreak(
    shiftId: string,
    dto: Parameters<ScrymeServerSDK["catalog"]["addBreak"]>[1],
  ): Promise<any> {
    return this.base.execute<any>(
      `/v3/{orgSlug}/services/shifts/${shiftId}/breaks`,
      () => this.base.scrymeServer.catalog.addBreak(shiftId, dto),
      true,
    );
  }
}
