import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ScrymeService } from "../scryme/scryme.service";

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  // Cache to store the products and the timestamp when the cache expires
  private cachedProducts: any[] | null = null;
  private cacheExpiresAt: number | null = null;

  constructor(
    private prisma: PrismaService,
    private scrymeService: ScrymeService,
  ) {}

  /**
   * Helper to sync/upsert Scryme products into local DB
   * so that local Prisma schema constraints are preserved.
   */
  private async syncProductsWithDb(products: any[]) {
    try {
      for (const item of products) {
        // Map the fields from Scryme product structure to local DB
        // Scryme fields: { id, name, description, retailPrice, stock, sku, etc }
        const price =
          typeof item.retailPrice === "number"
            ? item.retailPrice
            : typeof item.price === "number"
              ? item.price
              : 0;
        const stock = typeof item.stock === "number" ? item.stock : 100;
        const desc =
          typeof item.description === "string"
            ? item.description
            : item.description?.preferences || null;

        await this.prisma.product.upsert({
          where: { id: item.id },
          update: {
            name: item.name || "Unnamed Product",
            description: desc,
            price: price,
            stock: stock,
          },
          create: {
            id: item.id,
            name: item.name || "Unnamed Product",
            description: desc,
            price: price,
            stock: stock,
          },
        });
      }
    } catch (err) {
      this.logger.error(
        `Failed to sync products to local database: ${err.message}`,
      );
    }
  }

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
      this.logger.debug("Fetching products from Scryme...");
      const scrymeProducts = await this.scrymeService.listCatalogProducts();

      // Update cache
      this.cachedProducts = scrymeProducts;
      this.cacheExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour in ms

      // Synchronize in the background to ensure local Order consistency
      await this.syncProductsWithDb(scrymeProducts);

      return scrymeProducts;
    } catch (error) {
      this.logger.error(
        `Failed to fetch products from Scryme: ${error.message}. Falling back to local database.`,
      );
      // Fallback to local DB on error (e.g., during tests when Scryme is not fully available/mocked or offline)
      return this.prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      });
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

    // Otherwise, check local DB or fetch from Scryme (using list catalog as backup check)
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      // Try to re-fetch/re-populate cache as a fallback
      try {
        const freshProducts = await this.getAll();
        const foundFresh = freshProducts.find((p) => p.id === id);
        if (foundFresh) {
          return foundFresh;
        }
      } catch {}
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
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
