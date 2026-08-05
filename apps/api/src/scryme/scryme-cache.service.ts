import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import * as CacheManager from "cache-manager";
import Redis from "ioredis";

@Injectable()
export class ScrymeCacheService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ScrymeCacheService.name);
  private redisClient: Redis | null = null;
  private activeKeys = new Set<string>();

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: CacheManager.Cache,
  ) {}

  onModuleInit() {
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST;
    const redisPort = process.env.REDIS_PORT;
    const redisPassword = process.env.REDIS_PASSWORD;

    if (redisUrl || (redisHost && redisPort)) {
      try {
        this.logger.log(
          "Redis configuration detected. Initializing Redis client...",
        );
        if (redisUrl) {
          this.redisClient = new Redis(redisUrl, {
            maxRetriesPerRequest: 3,
          });
        } else {
          this.redisClient = new Redis({
            host: redisHost,
            port: Number(redisPort),
            password: redisPassword,
            maxRetriesPerRequest: 3,
          });
        }

        this.redisClient.on("error", (err) => {
          this.logger.error("Redis client connection error:", err);
        });

        this.redisClient.on("connect", () => {
          this.logger.log("Successfully connected to Redis.");
        });
      } catch (err) {
        this.logger.error(
          "Failed to initialize Redis client. Falling back to CacheManager.",
          err,
        );
        this.redisClient = null;
      }
    } else {
      this.logger.log(
        "No Redis configuration found in environment. Using in-memory CacheManager.",
      );
    }
  }

  onModuleDestroy() {
    if (this.redisClient) {
      try {
        this.redisClient.disconnect();
      } catch (err) {
        this.logger.error("Error disconnecting Redis client:", err);
      }
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.redisClient) {
        const val = await this.redisClient.get(key);
        return val ? (JSON.parse(val) as T) : null;
      } else {
        const val = await this.cacheManager.get<T>(key);
        return val ?? null;
      }
    } catch (err) {
      this.logger.error(`Error getting key ${key} from cache: ${err}`);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<void> {
    try {
      this.activeKeys.add(key);
      if (this.redisClient) {
        await this.redisClient.set(
          key,
          JSON.stringify(value),
          "EX",
          ttlSeconds,
        );
      } else {
        await this.cacheManager.set(key, value, ttlSeconds * 1000);
      }
    } catch (err) {
      this.logger.error(`Error setting key ${key} in cache: ${err}`);
    }
  }

  async del(key: string): Promise<void> {
    try {
      this.activeKeys.delete(key);
      if (this.redisClient) {
        await this.redisClient.del(key);
      } else {
        await this.cacheManager.del(key);
      }
    } catch (err) {
      this.logger.error(`Error deleting key ${key} from cache: ${err}`);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      this.logger.debug(`Invalidating pattern: ${pattern}`);
      if (this.redisClient) {
        const keys = await this.redisClient.keys(pattern);
        if (keys.length > 0) {
          this.logger.debug(`Deleting matching Redis keys: ${keys.join(", ")}`);
          await this.redisClient.del(...keys);
        }
      } else {
        const escaped = pattern
          .replace(/[.+^${}()|[\]\\]/g, "\\$&")
          .replace(/\*/g, ".*");
        const regex = new RegExp("^" + escaped + "$");
        const matchedKeys = Array.from(this.activeKeys).filter((key: string) =>
          regex.test(key),
        );

        if (matchedKeys.length > 0) {
          this.logger.debug(
            `Deleting matching CacheManager keys: ${matchedKeys.join(", ")}`,
          );
          for (const key of matchedKeys) {
            await this.cacheManager.del(key);
            this.activeKeys.delete(key);
          }
        }
      }
    } catch (err) {
      this.logger.error(`Error invalidating pattern ${pattern}: ${err}`);
    }
  }
}
