import { Test, TestingModule } from '@nestjs/testing';
import { ScrymeService } from './scryme.service';
import { HttpException } from '@nestjs/common';

describe('ScrymeService OAuth Token Exchange & Catalog Tests', () => {
  let service: ScrymeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrymeService],
    }).compile();

    service = module.get<ScrymeService>(ScrymeService);

    // Clear environment variables & caches
    delete process.env.SCRYME_CLIENT_ID;
    delete process.env.SCRYME_CLIENT_SECRET;
    service['cachedToken'] = null;
    service['tokenExpiresAt'] = null;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fall back to apiKey if SCRYME_CLIENT_ID or SCRYME_CLIENT_SECRET is missing', async () => {
    process.env.SCRYME_API_KEY = 'fallback-api-key';
    const token = await service.fetchAccessToken();
    expect(token).toBe('fallback-api-key');
  });

  it('should call fetch to exchange client credentials for token and cache it', async () => {
    process.env.SCRYME_CLIENT_ID = 'test-client-id';
    process.env.SCRYME_CLIENT_SECRET = 'test-client-secret';

    const mockResponse = {
      accessToken: 'jwt-access-token-123',
      tokenType: 'Bearer',
      expiresIn: 3600,
    };

    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as unknown as Response);

    const token = await service.fetchAccessToken();
    expect(token).toBe('jwt-access-token-123');
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/v3/auth/token'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          clientId: 'test-client-id',
          clientSecret: 'test-client-secret',
        }),
      }),
    );

    // Call again, should return cached token without calling fetch again
    const token2 = await service.fetchAccessToken();
    expect(token2).toBe('jwt-access-token-123');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if token exchange fails', async () => {
    process.env.SCRYME_CLIENT_ID = 'test-client-id';
    process.env.SCRYME_CLIENT_SECRET = 'test-client-secret';

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      text: () => Promise.resolve('Invalid client credentials'),
    } as unknown as Response);

    await expect(service.fetchAccessToken()).rejects.toThrow(HttpException);
  });
});
