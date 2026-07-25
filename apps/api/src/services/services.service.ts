import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.service.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getOne(id: string) {
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async create(dto: { name: string; description?: string; duration: number; price: number }) {
    if (dto.duration <= 0) {
      throw new BadRequestException('Duration must be greater than 0');
    }
    if (dto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }

    return this.prisma.service.create({
      data: dto,
    });
  }

  async update(id: string, dto: { name?: string; description?: string; duration?: number; price?: number }) {
    await this.getOne(id);

    if (dto.duration !== undefined && dto.duration <= 0) {
      throw new BadRequestException('Duration must be greater than 0');
    }
    if (dto.price !== undefined && dto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }

    return this.prisma.service.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.getOne(id);
    await this.prisma.service.delete({ where: { id } });
    return { success: true };
  }
}
