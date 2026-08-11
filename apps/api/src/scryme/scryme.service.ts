import { Injectable, Logger, HttpException } from "@nestjs/common";
import { ScrymeCacheService } from "./scryme-cache.service";
import { ScrymeServerSDK } from "@scryme/sdk/server";
import { ScrymeClientSDK } from "@scryme/sdk/client";

@Injectable()
export class ScrymeService {
  private readonly logger = new Logger(ScrymeService.name);
  public readonly scrymeServer: ScrymeServerSDK;
  public readonly scrymeClient: ScrymeClientSDK;

  constructor(private readonly cacheService: ScrymeCacheService) {
    const clientId = process.env.SCRYME_CLIENT_ID!;
    const clientSecret = process.env.SCRYME_CLIENT_SECRET!;
    const orgSlug = process.env.SCRYME_ORG_SLUG!;
    const baseURL = process.env.SCRYME_API_URL!;

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

  private get orgSlug(): string {
    return process.env.SCRYME_ORG_SLUG || "spa-test-org";
  }

  /**
   * Invalidation helper based on mutated path categories.
   */
  private async invalidateCacheForPath(resolvedPath: string): Promise<void> {
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

  // --- Customers ---

  async registerCustomer(
    dto: Parameters<ScrymeServerSDK["admin"]["registerCustomer"]>[0],
  ) {
    return this.execute(
      "/v3/{orgSlug}/customers/register",
      () => this.scrymeServer.admin.registerCustomer(dto),
      true,
    );
  }

  async listCustomers() {
    return this.execute(
      "/v3/{orgSlug}/customers",
      () => this.scrymeServer.admin.getCustomers(),
      false,
    );
  }

  async getCustomer(id: string) {
    return this.execute(
      `/v3/{orgSlug}/customers/${id}`,
      () => this.scrymeServer.admin.getCustomerById(id),
      false,
    );
  }

  async updateCustomer(
    id: string,
    dto: Parameters<ScrymeServerSDK["admin"]["updateCustomer"]>[1],
  ) {
    return this.execute(
      `/v3/{orgSlug}/customers/${id}`,
      () => this.scrymeServer.admin.updateCustomer(id, dto),
      true,
    );
  }

  async deleteCustomer(id: string) {
    return this.execute(
      `/v3/{orgSlug}/customers/${id}`,
      () => this.scrymeServer.admin.deleteCustomer(id),
      true,
    );
  }

  // --- Staff / Members ---

  async createMember(
    dto: Parameters<ScrymeServerSDK["members"]["createMember"]>[0],
  ) {
    return this.execute(
      "/v3/{orgSlug}/members",
      () => this.scrymeServer.members.createMember(dto),
      true,
    );
  }

  async listMembers() {
    return this.execute(
      "/v3/{orgSlug}/members",
      () => this.scrymeServer.members.getMembers(),
      false,
    );
  }

  async getMember(id: string) {
    return this.execute(
      `/v3/{orgSlug}/members/${id}`,
      () => this.scrymeServer.members.getMember(id),
      false,
    );
  }

  async updateMember(
    id: string,
    dto: Parameters<ScrymeServerSDK["members"]["updateMember"]>[1],
  ) {
    return this.execute(
      `/v3/{orgSlug}/members/${id}`,
      () => this.scrymeServer.members.updateMember(id, dto),
      true,
    );
  }

  async deleteMember(id: string) {
    return this.execute(
      `/v3/{orgSlug}/members/${id}`,
      () => this.scrymeServer.members.deleteMember(id),
      true,
    );
  }

  // --- Shifts ---

  async createShift(
    memberId: string,
    dto: Omit<
      Parameters<ScrymeServerSDK["catalog"]["createShift"]>[1],
      "dayOfWeek"
    > & { startTime: string },
  ) {
    const dayOfWeek = isNaN(new Date(dto.startTime).getTime())
      ? 1
      : new Date(dto.startTime).getDay();

    return this.execute(
      `/v3/{orgSlug}/services/staff/${memberId}/shifts`,
      () =>
        this.scrymeServer.catalog.createShift(memberId, {
          ...dto,
          dayOfWeek,
        }),
      true,
    );
  }

  async getStaffShifts(memberId: string) {
    return this.execute(
      `/v3/{orgSlug}/services/staff/${memberId}/shifts`,
      () => this.scrymeServer.catalog.getStaffShifts(memberId),
      false,
    );
  }

  async addBreak(
    shiftId: string,
    dto: Parameters<ScrymeServerSDK["catalog"]["addBreak"]>[1],
  ) {
    return this.execute(
      `/v3/{orgSlug}/services/shifts/${shiftId}/breaks`,
      () => this.scrymeServer.catalog.addBreak(shiftId, dto),
      true,
    );
  }

  // --- Bookings ---

  async createBooking(
    dto: Parameters<ScrymeServerSDK["catalog"]["createBooking"]>[0],
  ) {
    return this.execute(
      "/v3/{orgSlug}/services/bookings",
      () => this.scrymeServer.catalog.createBooking(dto),
      true,
    );
  }

  async listBookings() {
    return this.execute(
      "/v3/{orgSlug}/services/bookings",
      () => this.scrymeServer.catalog.getBookings(),
      false,
    );
  }

  async getBooking(id: string) {
    return this.execute(
      `/v3/{orgSlug}/services/bookings/${id}`,
      () => this.scrymeServer.catalog.getBooking(id),
      false,
    );
  }

  async updateBookingStatus(
    id: string,
    dto: Parameters<ScrymeServerSDK["catalog"]["updateBookingStatus"]>[1],
  ) {
    return this.execute(
      `/v3/{orgSlug}/services/bookings/${id}/status`,
      () => this.scrymeServer.catalog.updateBookingStatus(id, dto),
      true,
    );
  }

  async completeBooking(
    id: string,
    dto: Parameters<ScrymeServerSDK["catalog"]["completeBooking"]>[1],
  ) {
    return this.execute(
      `/v3/{orgSlug}/services/bookings/${id}/complete`,
      () => this.scrymeServer.catalog.completeBooking(id, dto),
      true,
    );
  }

  // --- Catalog ---

  async listCatalogProducts() {
    return this.execute(
      "/v3/{orgSlug}/catalog/products",
      () => this.scrymeServer.catalog.getProducts(),
      false,
    );
  }

  async listCatalogServices() {
    return this.execute(
      "/v3/{orgSlug}/catalog/services",
      () => this.scrymeServer.catalog.getServices(),
      false,
    );
  }

  // --- Orders ---

  async createOrder(
    dto: Parameters<ScrymeServerSDK["orders"]["createOrder"]>[0],
  ) {
    return this.execute(
      "/v3/{orgSlug}/orders",
      () => this.scrymeServer.orders.createOrder(dto),
      true,
    );
  }

  async listOrders() {
    return this.execute(
      "/v3/{orgSlug}/orders",
      () => this.scrymeServer.orders.getOrders(),
      false,
    );
  }

  async updateOrderStatus(
    id: string,
    dto: Parameters<ScrymeServerSDK["orders"]["updateStatus"]>[1],
  ) {
    return this.execute(
      `/v3/{orgSlug}/orders/${id}/status`,
      () => this.scrymeServer.orders.updateStatus(id, dto),
      true,
    );
  }
}
