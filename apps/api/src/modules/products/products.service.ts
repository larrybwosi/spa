import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { ScrymeService } from "@/integrations/scryme/scryme.service";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  // Cache to store the products and the timestamp when the cache expires
  private cachedProducts: any[] | null = null;
  private cacheExpiresAt: number | null = null;

  constructor(
    private prisma: PrismaService,
    private scryme: ScrymeService,
  ) {}

  async getAll() {
    // If cache is valid, return cached products
    if (
      this.cachedProducts &&
      this.cacheExpiresAt &&
      this.cacheExpiresAt > Date.now()
    ) {
      return this.cachedProducts;
    }

    try {
      console.log("Fetching products from Scryme...");
      const scrymeProducts = await this.scryme.listCatalogProducts();

      // Update cache
      this.cachedProducts = scrymeProducts;
      this.cacheExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour in ms

      return scrymeProducts;
    } catch (error: any) {
      console.log(
        `Failed to fetch products from Scryme: ${error.message}. Falling back to stale cache.`,
      );
      this.logger.error(
        `Failed to fetch products from Scryme: ${error.message}. Falling back to stale cache.`,
      );
      // Fallback to stale cache if available
      if (this.cachedProducts) {
        return this.cachedProducts;
      }
      throw error;
    }
  }

  async getOne(id: string) {
    // Attempt to get from cache first
    if (this.cachedProducts) {
      const found = this.cachedProducts.find((p) => p.id === id);
      if (found) {
        return found;
      }
    }

    try {
      const freshProducts = await this.scryme.api.catalog.getProducts();
      const foundFresh = freshProducts.data.find((p) => p.id === id);
      if (foundFresh) {
        return foundFresh;
      }
    } catch {
      // Ignored, handle exception if not found below
    }

    throw new NotFoundException(`Product with ID ${id} not found`);
  }

  async create(dto: {
    name: string;
    description?: string;
    price: number;
    stock: number;
  }) {
    if (dto.price < 0) {
      throw new BadRequestException("Price cannot be negative");
    }
    if (dto.stock < 0) {
      throw new BadRequestException("Stock cannot be negative");
    }

    return this.prisma.product.create({
      data: dto,
    });
  }

  async update(
    id: string,
    dto: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
    },
  ) {
    await this.getOne(id);

    if (dto.price !== undefined && dto.price < 0) {
      throw new BadRequestException("Price cannot be negative");
    }
    if (dto.stock !== undefined && dto.stock < 0) {
      throw new BadRequestException("Stock cannot be negative");
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
