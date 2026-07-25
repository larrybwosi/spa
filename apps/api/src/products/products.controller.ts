import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { BetterAuthGuard } from '../auth/better-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async getAll() {
    return this.productsService.getAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.productsService.getOne(id);
  }

  @Post()
  @UseGuards(BetterAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async create(@Body() body: { name: string; description?: string; price: number; stock: number }) {
    return this.productsService.create(body);
  }

  @Put(':id')
  @UseGuards(BetterAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; price?: number; stock?: number },
  ) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(BetterAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
