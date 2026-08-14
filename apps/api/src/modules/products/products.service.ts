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
      const scrymeProducts = await this.scryme.api.catalog.getProducts();

      // Update cache
      this.cachedProducts = scrymeProducts.data;
      this.cacheExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour in ms

      return scrymeProducts.data;
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
    try {
      const freshProduct = await this.scryme.api.catalog.getProduct(id);
      if (freshProduct) {
        return freshProduct.data;
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        console.log(error);
        throw error;
      } else {
        throw error;
      }
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
