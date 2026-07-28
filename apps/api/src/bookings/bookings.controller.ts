import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { BetterAuthGuard } from "../auth/better-auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import { BookingStatus } from "@prisma/client";

@Controller("bookings")
@UseGuards(BetterAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Get()
  async getAll(@CurrentUser() user: any) {
    return this.bookingsService.getAll(user);
  }

  @Get(":id")
  async getOne(@Param("id") id: string, @CurrentUser() user: any) {
    return this.bookingsService.getOne(id, user);
  }

  @Post()
  async create(
    @CurrentUser() user: any,
    @Body()
    body: {
      clientId?: string;
      serviceId: string;
      staffId: string;
      dateTime: string;
    },
  ) {
    return this.bookingsService.create(user, body);
  }

  @Patch(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @CurrentUser() user: any,
    @Body("status") status: BookingStatus,
  ) {
    return this.bookingsService.updateStatus(id, user, status);
  }
}
