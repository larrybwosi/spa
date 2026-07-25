import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(dto: { name: string; description?: string; price: number; stock: number }) {
    if (dto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }
    if (dto.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    return this.prisma.product.create({
      data: dto,
    });
  }

  async update(id: string, dto: { name?: string; description?: string; price?: number; stock?: number }) {
    await this.getOne(id);

    if (dto.price !== undefined && dto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }
    if (dto.stock !== undefined && dto.stock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.getOne(id);
    await this.prisma.product.delete({ where: { id } });
    return { success: true };
  }
}
