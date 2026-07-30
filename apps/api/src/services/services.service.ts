import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ScrymeService } from "../scryme/scryme.service";

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

  /**
   * Helper to sync/upsert Scryme services into local DB
   * so that local Prisma schema constraints are preserved.
   */
  private async syncServicesWithDb(services: any[]) {
    try {
      for (const item of services) {
        // Map fields from Scryme service structure to local DB
        // Scryme fields: { id, name, description, retailPrice, duration, etc }
        const price =
          typeof item.retailPrice === "number"
            ? item.retailPrice
            : typeof item.price === "number"
              ? item.price
              : 0;
        const duration = typeof item.duration === "number" ? item.duration : 60;
        const desc =
          typeof item.description === "string"
            ? item.description
            : item.description?.preferences || null;

        await this.prisma.service.upsert({
          where: { id: item.id },
          update: {
            name: item.name || "Unnamed Service",
            description: desc,
            duration: duration,
            price: price,
          },
          create: {
            id: item.id,
            name: item.name || "Unnamed Service",
            description: desc,
            duration: duration,
            price: price,
          },
        });
      }
    } catch (err) {
      this.logger.error(
        `Failed to sync services to local database: ${err.message}`,
      );
    }
  }

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

      // Synchronize in the background to ensure local Booking consistency
      await this.syncServicesWithDb(scrymeServices);

      return scrymeServices;
    } catch (error) {
      this.logger.error(
        `Failed to fetch services from Scryme: ${error.message}. Falling back to local database.`,
      );
      // Fallback to local DB on error (e.g., during tests when Scryme is not fully available/mocked or offline)
      return this.prisma.service.findMany({
        orderBy: { name: "asc" },
      });
    }
  }

  async getOne(id: string) {
    // Attempt to get from cache first
    if (this.cachedServices) {
      const found = this.cachedServices.find((s) => s.id === id);
      if (found) {
        return found;
      }
    }

    // Otherwise, check local DB or fetch from Scryme (using list catalog as backup check)
    const service = await this.prisma.service.findUnique({ where: { id } });
    if (!service) {
      // Try to re-fetch/re-populate cache as a fallback
      try {
        const freshServices = await this.getAll();
        const foundFresh = freshServices.find((s) => s.id === id);
        if (foundFresh) {
          return foundFresh;
        }
      } catch {}
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
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
