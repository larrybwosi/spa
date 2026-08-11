import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { ScrymeService } from "./scryme.service";
import { BetterAuthGuard } from "../auth/better-auth.guard";
import { CreateMemberDto } from "@scryme/sdk";

@Controller("scryme")
@UseGuards(BetterAuthGuard)
export class ScrymeController {
  constructor(private readonly scrymeService: ScrymeService) {}

  // --- Customers ---

  @Get("customers")
  async listCustomers() {
    return this.scrymeService.listCustomers();
  }

  @Post("customers")
  async registerCustomer(
    @Body()
    body: {
      name: string;
      email: string;
      phone?: string;
      zitadelUserId?: string;
    },
  ) {
    return this.scrymeService.registerCustomer(body);
  }

  @Get("customers/:id")
  async getCustomer(@Param("id") id: string) {
    return this.scrymeService.getCustomer(id);
  }

  @Patch("customers/:id")
  async updateCustomer(@Param("id") id: string, @Body() body: any) {
    return this.scrymeService.updateCustomer(id, body);
  }

  @Delete("customers/:id")
  async deleteCustomer(@Param("id") id: string) {
    return this.scrymeService.deleteCustomer(id);
  }

  // --- Staff / Members ---

  @Get("members")
  async listMembers() {
    return this.scrymeService.listMembers();
  }

  @Post("members")
  async createMember(
    @Body() body: { name: string; email: string; role: string },
  ) {
    return this.scrymeService.createMember({
      ...body,
      role: body.role as CreateMemberDto["role"],
    });
  }

  @Get("members/:id")
  async getMember(@Param("id") id: string) {
    return this.scrymeService.getMember(id);
  }

  @Patch("members/:id")
  async updateMember(@Param("id") id: string, @Body() body: any) {
    return this.scrymeService.updateMember(id, body);
  }

  @Delete("members/:id")
  async deleteMember(@Param("id") id: string) {
    return this.scrymeService.deleteMember(id);
  }

  // --- Shifts & Breaks ---

  @Post("staff/:memberId/shifts")
  async createShift(
    @Param("memberId") memberId: string,
    @Body() body: { startTime: string; endTime: string },
  ) {
    return this.scrymeService.createShift(memberId, body);
  }

  @Get("staff/:memberId/shifts")
  async getStaffShifts(@Param("memberId") memberId: string) {
    return this.scrymeService.getStaffShifts(memberId);
  }

  @Post("shifts/:shiftId/breaks")
  async addBreak(
    @Param("shiftId") shiftId: string,
    @Body() body: { startTime: string; endTime: string },
  ) {
    return this.scrymeService.addBreak(shiftId, body);
  }
}
