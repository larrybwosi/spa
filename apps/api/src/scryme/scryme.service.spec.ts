import { Test, TestingModule } from "@nestjs/testing";
import { ScrymeService } from "./scryme.service";
import { ScrymeCacheService } from "./scryme-cache.service";
import { HttpException } from "@nestjs/common";

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

    // Clear environment variables & caches
    delete process.env.SCRYME_CLIENT_ID;
    delete process.env.SCRYME_CLIENT_SECRET;
    service["cachedToken"] = null;
    service["tokenExpiresAt"] = null;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should fall back to apiKey if SCRYME_CLIENT_ID or SCRYME_CLIENT_SECRET is missing", async () => {
    process.env.SCRYME_API_KEY = "fallback-api-key";
    const token = await service.fetchAccessToken();
    expect(token).toBe("fallback-api-key");
  });

  it("should call fetch to exchange client credentials for token and cache it", async () => {
    process.env.SCRYME_CLIENT_ID = "test-client-id";
    process.env.SCRYME_CLIENT_SECRET = "test-client-secret";

    const mockResponse = {
      accessToken: "jwt-access-token-123",
      tokenType: "Bearer",
      expiresIn: 3600,
    };

    mockCacheService.get.mockResolvedValue(null);

    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as unknown as Response);

    const token = await service.fetchAccessToken();
    expect(token).toBe("jwt-access-token-123");
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("/v3/auth/token"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          clientId: "test-client-id",
          clientSecret: "test-client-secret",
        }),
      }),
    );

    expect(mockCacheService.set).toHaveBeenCalledWith(
      "scryme:auth:token",
      "jwt-access-token-123",
      3600,
    );

    // Call again, should return cached token from local memory without calling fetch or cacheService again
    const token2 = await service.fetchAccessToken();
    expect(token2).toBe("jwt-access-token-123");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("should return token from ScrymeCacheService if cached", async () => {
    process.env.SCRYME_CLIENT_ID = "test-client-id";
    process.env.SCRYME_CLIENT_SECRET = "test-client-secret";

    mockCacheService.get.mockResolvedValue("cached-jwt-token");

    const token = await service.fetchAccessToken();
    expect(token).toBe("cached-jwt-token");
    expect(mockCacheService.get).toHaveBeenCalledWith("scryme:auth:token");
  });

  it("should throw an error if token exchange fails", async () => {
    process.env.SCRYME_CLIENT_ID = "test-client-id";
    process.env.SCRYME_CLIENT_SECRET = "test-client-secret";

    mockCacheService.get.mockResolvedValue(null);

    jest.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      text: () => Promise.resolve("Invalid client credentials"),
    } as unknown as Response);

    await expect(service.fetchAccessToken()).rejects.toThrow(HttpException);
  });

  it("should cache successful GET requests and invalidate on mutation requests", async () => {
    process.env.SCRYME_CLIENT_ID = "test-client-id";
    process.env.SCRYME_CLIENT_SECRET = "test-client-secret";

    // Mock GET requests & Token exchange using conditional mocking
    let hasGetCache = false;
    const mockData = { items: [1, 2, 3] };

    mockCacheService.get.mockImplementation((key: string) => {
      if (key === "scryme:auth:token") {
        return Promise.resolve("mocked-token");
      }
      if (key === "scryme:req:GET:/v3/spa-test-org/customers") {
        return Promise.resolve(hasGetCache ? mockData : null);
      }
      return Promise.resolve(null);
    });

    const fetchSpy = jest.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(JSON.stringify(mockData)),
    } as unknown as Response);

    // First request: Cache miss
    const result1 = await service.request("GET", "/v3/{orgSlug}/customers");
    expect(result1).toEqual(mockData);
    expect(mockCacheService.set).toHaveBeenCalledWith(
      "scryme:req:GET:/v3/spa-test-org/customers",
      mockData,
      3600,
    );

    // Simulate cache updated
    hasGetCache = true;

    // Second request: Cache hit
    const result2 = await service.request("GET", "/v3/{orgSlug}/customers");
    expect(result2).toEqual(mockData);

    // Mutate request: POST customer register -> should invalidate pattern
    fetchSpy.mockResolvedValueOnce({
      ok: true,
      text: () => Promise.resolve(JSON.stringify({ success: true })),
    } as unknown as Response);

    await service.request("POST", "/v3/{orgSlug}/customers/register", {
      name: "Bob",
    });
    expect(mockCacheService.invalidatePattern).toHaveBeenCalledWith(
      "scryme:req:GET:/v3/*/customers*",
    );
  });
});
