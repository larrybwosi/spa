import { Test, TestingModule } from "@nestjs/testing";
import { ScrymeService } from "./scryme.service";
import { ScrymeCacheService } from "./scryme-cache.service";

describe("ScrymeService OAuth Token Exchange & Catalog Tests", () => {
  let service: ScrymeService;

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    invalidatePattern: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrymeService,
        {
          provide: ScrymeCacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<ScrymeService>(ScrymeService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize client and server SDK instances", () => {
    expect(service.scrymeServer).toBeDefined();
    expect(service.scrymeClient).toBeDefined();
  });

  it("should call auth.authenticate on scrymeServer for fetchAccessToken", async () => {
    const authSpy = jest.spyOn(service.scrymeServer.auth, "authenticate").mockResolvedValue({
      token: "mocked-token-abc",
    });

    const token = await service.fetchAccessToken();
    expect(token).toBe("mocked-token-abc");
    expect(authSpy).toHaveBeenCalled();
  });

  it("should handle error in fetchAccessToken and return a fallback", async () => {
    jest.spyOn(service.scrymeServer.auth, "authenticate").mockRejectedValue(new Error("Auth failed"));

    const token = await service.fetchAccessToken();
    expect(token).toBe("test-access-token");
  });

  it("should cache successful GET requests and invalidate on mutation requests", async () => {
    const mockProducts = [{ id: "p1", name: "Product 1" }];

    // Mock catalog.getProducts AxiosResponse
    const getProductsSpy = jest.spyOn(service.scrymeServer.catalog, "getProducts").mockResolvedValue({
      data: mockProducts,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    });

    // Mock GET requests caching
    let hasGetCache = false;
    mockCacheService.get.mockImplementation((key: string) => {
      if (key === "scryme:req:GET:/v3/spa-test-org/catalog/products") {
        return Promise.resolve(hasGetCache ? mockProducts : null);
      }
      return Promise.resolve(null);
    });

    // First request: Cache miss
    const result1 = await service.listCatalogProducts();
    expect(result1).toEqual(mockProducts);
    expect(getProductsSpy).toHaveBeenCalledTimes(1);
    expect(mockCacheService.set).toHaveBeenCalledWith(
      "scryme:req:GET:/v3/spa-test-org/catalog/products",
      mockProducts,
      3600,
    );

    // Simulate cache updated
    hasGetCache = true;

    // Second request: Cache hit
    const result2 = await service.listCatalogProducts();
    expect(result2).toEqual(mockProducts);
    expect(getProductsSpy).toHaveBeenCalledTimes(1); // Should still be 1 (from first call)

    // Mutation request: create a product
    const createProductSpy = jest.spyOn(service.scrymeServer.catalog, "createProduct").mockResolvedValue({
      data: { id: "p2", name: "Product 2" },
      status: 201,
      statusText: "Created",
      headers: {},
      config: {} as any,
    });

    await service.execute<any>(
      "/v3/{orgSlug}/catalog/products",
      () => service.scrymeServer.catalog.createProduct({ name: "Product 2" } as any),
      true,
    );

    expect(createProductSpy).toHaveBeenCalled();
    expect(mockCacheService.invalidatePattern).toHaveBeenCalledWith(
      "scryme:req:GET:/v3/*/catalog/products*",
    );
  });
});
