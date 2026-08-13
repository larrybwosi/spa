import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "./products.service";
import { PrismaService } from "@/prisma.service";
import { ScrymeService } from "@/integrations/scryme/scryme.service";
import { NotFoundException } from "@nestjs/common";

describe("ProductsService", () => {
  let service: ProductsService;
  let scrymeService: ScrymeService;

  const mockProducts = [
    { id: "p1", name: "Product 1", price: 10, stock: 5 },
    { id: "p2", name: "Product 2", price: 20, stock: 10 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              upsert: jest.fn().mockResolvedValue({}),
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn().mockResolvedValue(null),
            },
          },
        },
        {
          provide: ScrymeService,
          useValue: {
            listCatalogProducts: jest.fn().mockResolvedValue(mockProducts),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    scrymeService = module.get<ScrymeService>(ScrymeService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should fetch products from Scryme and cache them", async () => {
    const result = await service.getAll();
    expect(result).toEqual(mockProducts);
    expect(scrymeService.listCatalogProducts).toHaveBeenCalledTimes(1);

    // Second call should hit the cache and not call listCatalogProducts again
    const cachedResult = await service.getAll();
    expect(cachedResult).toEqual(mockProducts);
    expect(scrymeService.listCatalogProducts).toHaveBeenCalledTimes(1);
  });

  it("should fall back to stale cache on Scryme error if available", async () => {
    // First successful fetch to populate cache
    await service.getAll();

    // Mock Scryme to fail next time
    jest
      .spyOn(scrymeService, "listCatalogProducts")
      .mockRejectedValue(new Error("Scryme offline"));
    // Force cache expiration to trigger reload
    service["cacheExpiresAt"] = 0;

    const result = await service.getAll();
    expect(result).toEqual(mockProducts);
  });

  it("should throw error on Scryme error if cache is empty", async () => {
    jest
      .spyOn(scrymeService, "listCatalogProducts")
      .mockRejectedValue(new Error("Scryme offline"));
    await expect(service.getAll()).rejects.toThrow("Scryme offline");
  });

  it("should find product from cache in getOne", async () => {
    await service.getAll(); // populate cache
    const prod = await service.getOne("p2");
    expect(prod).toEqual(mockProducts[1]);
  });

  it("should throw NotFoundException if product is not found in cache or fresh fetch", async () => {
    await service.getAll(); // populate cache
    await expect(service.getOne("non-existent")).rejects.toThrow(
      NotFoundException,
    );
  });
});
