import { Test, TestingModule } from "@nestjs/testing";
import { ServicesService } from "./services.service";
import { PrismaService } from "../prisma.service";
import { ScrymeService } from "../scryme/scryme.service";
import { NotFoundException } from "@nestjs/common";

describe("ServicesService", () => {
  let service: ServicesService;
  let scrymeService: ScrymeService;

  const mockServices = [
    { id: "s1", name: "Service 1", price: 50, duration: 30 },
    { id: "s2", name: "Service 2", price: 100, duration: 60 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: PrismaService,
          useValue: {
            service: {
              upsert: jest.fn().mockResolvedValue({}),
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn().mockResolvedValue(null),
            },
          },
        },
        {
          provide: ScrymeService,
          useValue: {
            listCatalogServices: jest.fn().mockResolvedValue(mockServices),
          },
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    scrymeService = module.get<ScrymeService>(ScrymeService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should fetch services from Scryme and cache them", async () => {
    const result = await service.getAll();
    expect(result).toEqual(mockServices);
    expect(scrymeService.listCatalogServices).toHaveBeenCalledTimes(1);

    // Second call should hit the cache and not call listCatalogServices again
    const cachedResult = await service.getAll();
    expect(cachedResult).toEqual(mockServices);
    expect(scrymeService.listCatalogServices).toHaveBeenCalledTimes(1);
  });

  it("should fall back to stale cache on Scryme error if available", async () => {
    // First successful fetch to populate cache
    await service.getAll();

    // Mock Scryme to fail next time
    jest
      .spyOn(scrymeService, "listCatalogServices")
      .mockRejectedValue(new Error("Scryme offline"));
    // Force cache expiration to trigger reload
    service["cacheExpiresAt"] = 0;

    const result = await service.getAll();
    expect(result).toEqual(mockServices);
  });

  it("should throw error on Scryme error if cache is empty", async () => {
    jest
      .spyOn(scrymeService, "listCatalogServices")
      .mockRejectedValue(new Error("Scryme offline"));
    await expect(service.getAll()).rejects.toThrow("Scryme offline");
  });

  it("should find service from cache in getOne", async () => {
    await service.getAll(); // populate cache
    const serv = await service.getOne("s2");
    expect(serv).toEqual(mockServices[1]);
  });

  it("should throw NotFoundException if service is not found in cache or fresh fetch", async () => {
    await service.getAll(); // populate cache
    await expect(service.getOne("non-existent")).rejects.toThrow(
      NotFoundException,
    );
  });
});
