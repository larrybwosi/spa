import { Injectable, Logger, HttpException } from "@nestjs/common";
import { ScrymeCacheService } from "./scryme-cache.service";
import { ScrymeServerSDK } from "@scryme/sdk/server";
import { ScrymeClientSDK } from "@scryme/sdk/client";

@Injectable()
export class ScrymeBaseService {
  private readonly logger = new Logger(ScrymeBaseService.name);
  public readonly scrymeServer: ScrymeServerSDK;
  public readonly scrymeClient: ScrymeClientSDK;

  constructor(private readonly cacheService: ScrymeCacheService) {
    const clientId = process.env.SCRYME_CLIENT_ID || "test-client-id";
    const clientSecret = process.env.SCRYME_CLIENT_SECRET || "test-client-secret";
    const orgSlug = process.env.SCRYME_ORG_SLUG || "spa-test-org";
    const baseURL = process.env.SCRYME_API_URL || "http://localhost:3001";

    this.scrymeServer = new ScrymeServerSDK({
      clientId,
      clientSecret,
      orgSlug,
      baseURL,
    });

    this.scrymeClient = new ScrymeClientSDK({
      clientId,
      clientSecret,
      orgSlug,
      baseURL,
    });
  }

  public get orgSlug(): string {
    return process.env.SCRYME_ORG_SLUG || "spa-test-org";
  }

  /**
   * Invalidation helper based on mutated path categories.
   */
  public async invalidateCacheForPath(resolvedPath: string): Promise<void> {
    if (resolvedPath.includes("/customers")) {
      await this.cacheService.invalidatePattern(
        `scryme:req:GET:/v3/*/customers*`,
      );
    } else if (resolvedPath.includes("/members")) {
      await this.cacheService.invalidatePattern(
        `scryme:req:GET:/v3/*/members*`,
      );
    } else if (
      resolvedPath.includes("/shifts") ||
      resolvedPath.includes("/breaks")
    ) {
      await this.cacheService.invalidatePattern(
        `scryme:req:GET:/v3/*/services/staff/*/shifts*`,
      );
    } else if (resolvedPath.includes("/bookings")) {
      await this.cacheService.invalidatePattern(
        `scryme:req:GET:/v3/*/services/bookings*`,
      );
    } else if (resolvedPath.includes("/orders")) {
      await this.cacheService.invalidatePattern(`scryme:req:GET:/v3/*/orders*`);
    } else if (resolvedPath.includes("/catalog/products")) {
      await this.cacheService.invalidatePattern(
        `scryme:req:GET:/v3/*/catalog/products*`,
      );
    } else if (resolvedPath.includes("/catalog/services")) {
      await this.cacheService.invalidatePattern(
        `scryme:req:GET:/v3/*/catalog/services*`,
      );
    } else {
      await this.cacheService.invalidatePattern(`scryme:req:GET:*`);
    }
  }

  /**
   * Helper to execute SDK methods with cache support.
   */
  async execute<T>(
    cachePath: string,
    action: () => Promise<{ data: T }>,
    isMutation = false,
  ): Promise<T> {
    const resolvedPath = cachePath.replace("{orgSlug}", this.orgSlug);
    const cacheKey = `scryme:req:GET:${resolvedPath}`;

    if (!isMutation) {
      try {
        const cachedData = await this.cacheService.get<T>(cacheKey);
        if (cachedData) {
          this.logger.debug(`Cache hit for Scryme GET ${resolvedPath}`);
          return cachedData;
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.error(`Error reading GET from cache: ${message}`);
      }
    }

    try {
      const response = await action();
      const result = response.data;

      if (!isMutation) {
        try {
          await this.cacheService.set(cacheKey, result, 3600);
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          this.logger.error(`Error caching GET response: ${message}`);
        }
      } else {
        await this.invalidateCacheForPath(resolvedPath);
      }

      return result;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string }; status?: number };
        message?: string;
      };
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unknown Scryme SDK error";
      const status = err?.response?.status || 502;
      this.logger.error(`Scryme SDK error (${status}): ${message}`);
      throw new HttpException(`Scryme connection failure: ${message}`, status);
    }
  }
}
