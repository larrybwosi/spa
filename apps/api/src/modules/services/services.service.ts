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

  // Cache to store the services and the timestamp when the cache expires
  private cachedServices: any[] | null = null;
  private cacheExpiresAt: number | null = null;

  constructor(
    private prisma: PrismaService,
    private scrymeService: ScrymeService,
  ) {}

  async getAll() {
    // If cache is valid, return cached services
    if (
      this.cachedServices &&
      this.cacheExpiresAt &&
      this.cacheExpiresAt > Date.now()
    ) {
      return this.cachedServices;
    }

    try {
      this.logger.debug("Fetching services from Scryme...");
      const scrymeServices = await this.scrymeService.listCatalogServices();

      // Update cache
      this.cachedServices = scrymeServices;
      this.cacheExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour in ms

      return scrymeServices;
    } catch (error: any) {
      this.logger.error(
        `Failed to fetch services from Scryme: ${error.message}. Falling back to stale cache.`,
      );
      // Fallback to stale cache if available
      if (this.cachedServices) {
        return this.cachedServices;
      }
      throw error;
    }
  }

  async getOne(id: string) {
    // Try to find in cache first
    if (this.cachedServices) {
      const cached = this.cachedServices.find((s) => s.id === id);
      if (cached) {
        return cached;
      }
    }

    try {
      const service = await this.scrymeService.api?.catalog?.getService(id);
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
