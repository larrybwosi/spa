import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { BetterAuthGuard } from '../auth/better-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  async getAll() {
    return this.servicesService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.servicesService.getOne(id);
  }

  @Post()
  @UseGuards(BetterAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() body: { name: string; description?: string; duration: number; price: number }) {
    return this.servicesService.create(body);
  }

  @Put(':id')
  @UseGuards(BetterAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; duration?: number; price?: number },
  ) {
    return this.servicesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(BetterAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return this.servicesService.delete(id);
  }
}
