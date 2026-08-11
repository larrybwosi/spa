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

  constructor(
    private prisma: PrismaService,
    private scrymeService: ScrymeService,
  ) {}

  async getAll() {
    try {
      console.log("Fetching products from Scryme...");
      const scrymeProducts = await this.scrymeService.listCatalogProducts();

      return scrymeProducts;
    } catch (error) {
      console.log(
        `Failed to fetch products from Scryme: ${error.message}. Falling back to stale cache.`,
      );
      this.logger.error(
        `Failed to fetch products from Scryme: ${error.message}. Falling back to stale cache.`,
      );
      throw error;
    }
  }

  async getOne(id: string) {
    try {
      const freshProducts = await this.getAll();
      const foundFresh = freshProducts.find((p) => p.id === id);
      if (foundFresh) {
        return foundFresh;
      }
      // const product = await this.scrymeService.getProduct(id);
      // if (product) {
      //   return product;
      // }
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
