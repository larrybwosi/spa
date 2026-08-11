import { Injectable } from "@nestjs/common";
import { ScrymeBaseService } from "./scryme-base.service";
import { ScrymeServerSDK } from "@scryme/sdk/server";

@Injectable()
export class ScrymeMembersService {
  constructor(private readonly base: ScrymeBaseService) {}

  async createMember(
    dto: Parameters<ScrymeServerSDK["members"]["createMember"]>[0],
  ): Promise<any> {
    return this.base.execute<any>(
      "/v3/{orgSlug}/members",
      () => this.base.scrymeServer.members.createMember(dto),
      true,
    );
  }

  async listMembers(): Promise<any[]> {
    return this.base.execute<any[]>(
      "/v3/{orgSlug}/members",
      () => this.base.scrymeServer.members.getMembers() as any,
      false,
    );
  }

  async getMember(id: string): Promise<any> {
    return this.base.execute<any>(
      `/v3/{orgSlug}/members/${id}`,
      () => this.base.scrymeServer.members.getMember(id) as any,
      false,
    );
  }

  async updateMember(
    id: string,
    dto: Parameters<ScrymeServerSDK["members"]["updateMember"]>[1],
  ): Promise<any> {
    return this.base.execute<any>(
      `/v3/{orgSlug}/members/${id}`,
      () => this.base.scrymeServer.members.updateMember(id, dto),
      true,
    );
  }

  async deleteMember(id: string): Promise<any> {
    return this.base.execute<any>(
      `/v3/{orgSlug}/members/${id}`,
      () => this.base.scrymeServer.members.deleteMember(id),
      true,
    );
  }
}
