import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { ScrymeService } from "@/integrations/scryme/scryme.service";

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    private prisma: PrismaService,
    private scrymeService: ScrymeService,
  ) {}

  async getAll() {
    try {
      this.logger.debug("Fetching services from Scryme...");
      const scrymeServices = await this.scrymeService.api.catalog.getServices();
      return scrymeServices.data;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch services from Scryme: ${error.message}.`,
      );
      throw error;
    }
  }

  async getOne(id: string) {
    try {
      const service = await this.scrymeService.api.catalog.getService(id);
      if (service) {
        return service.data;
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        console.log(error);
        throw error;
      } else {
        // Ignored reading fresh services fallback
      }
    }

    throw new NotFoundException(`Service with ID ${id} not found`);
  }

  async create(dto: {
    name: string;
    description?: string;
    duration: number;
    price: number;
  }) {
    if (dto.duration <= 0) {
      throw new BadRequestException("Duration must be greater than 0");
    }
    if (dto.price < 0) {
      throw new BadRequestException("Price cannot be negative");
    }

    return this.prisma.service.create({
      data: dto,
    });
  }

  async update(
    id: string,
    dto: {
      name?: string;
      description?: string;
      duration?: number;
      price?: number;
    },
  ) {
    await this.getOne(id);

    if (dto.duration !== undefined && dto.duration <= 0) {
      throw new BadRequestException("Duration must be greater than 0");
    }
    if (dto.price !== undefined && dto.price < 0) {
      throw new BadRequestException("Price cannot be negative");
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
