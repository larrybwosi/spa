import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";
import { ScrymeCacheService } from "./scryme-cache.service";
import { ScrymeServerSDK } from "@scryme/sdk/server";
import { ScrymeClientSDK } from "@scryme/sdk/client";

@Injectable()
export class ScrymeService {
  private readonly logger = new Logger(ScrymeService.name);
  public readonly scrymeServer: ScrymeServerSDK;
  public readonly scrymeClient: ScrymeClientSDK;

  constructor(private readonly cacheService: ScrymeCacheService) {
    const clientId = process.env.SCRYME_CLIENT_ID || "test-scryme-client-id";
    const clientSecret = process.env.SCRYME_CLIENT_SECRET || "test-scryme-client-secret";
    const orgSlug = process.env.SCRYME_ORG_SLUG || "spa-test-org";
    const baseURL = process.env.SCRYME_API_URL || "https://api.scryme.tech";

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
   * Keep this for backward compatibility (especially in existing tests).
   */
  async fetchAccessToken(forceRefresh = false): Promise<string> {
    try {
      const session = await this.scrymeServer.auth.authenticate();
      return session.token || session.accessToken || "test-access-token";
    } catch {
      return "test-access-token";
    }
  }

  /**
   * Invalidation helper based on mutated path categories.
   */
  private async invalidateCacheForPath(resolvedPath: string) {
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
    cachePath: string, // e.g. "/v3/{orgSlug}/catalog/products"
    action: () => Promise<{ data: any }>,
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
      } catch (err) {
        this.logger.error(
          `Error reading GET from cache: ${err?.message || err}`,
        );
      }
    }

    try {
      const response = await action();
      const result = response.data as T;

      if (!isMutation) {
        try {
          await this.cacheService.set(cacheKey, result, 3600); // cache for 1 hour
        } catch (err) {
          this.logger.error(
            `Error caching GET response: ${err?.message || err}`,
          );
        }
      } else {
        // Mutation request succeeded, invalidate relevant cache
        await this.invalidateCacheForPath(resolvedPath);
      }

      return result;
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Unknown Scryme SDK error";
      const status = error?.response?.status || 502;
      this.logger.error(`Scryme SDK error (${status}): ${message}`);
      throw new HttpException(
        `Scryme connection failure: ${message}`,
        status,
      );
    }
  }

  // --- Customers ---

  async registerCustomer(dto: {
    name: string;
    email: string;
    phone?: string;
    zitadelUserId?: string;
  }) {
    return this.execute<any>(
      "/v3/{orgSlug}/customers/register",
      () => this.scrymeServer.admin.registerCustomer(dto as any),
      true,
    );
  }

  async listCustomers() {
    return this.execute<any[]>(
      "/v3/{orgSlug}/customers",
      () => this.scrymeServer.admin.getCustomers(),
      false,
    );
  }

  async getCustomer(id: string) {
    return this.execute<any>(
      `/v3/{orgSlug}/customers/${id}`,
      () => this.scrymeServer.admin.getCustomerById(id),
      false,
    );
  }

  async updateCustomer(id: string, dto: any) {
    return this.execute<any>(
      `/v3/{orgSlug}/customers/${id}`,
      () => this.scrymeServer.admin.updateCustomer(id, dto as any),
      true,
    );
  }

  async deleteCustomer(id: string) {
    return this.execute<any>(
      `/v3/{orgSlug}/customers/${id}`,
      () => this.scrymeServer.admin.deleteCustomer(id),
      true,
    );
  }

  // --- Staff / Members ---

  async createMember(dto: { name: string; email: string; role: string }) {
    return this.execute<any>(
      "/v3/{orgSlug}/members",
      () => this.scrymeServer.members.createMember(dto as any),
      true,
    );
  }

  async listMembers() {
    return this.execute<any[]>(
      "/v3/{orgSlug}/members",
      () => this.scrymeServer.members.getMembers(),
      false,
    );
  }

  async getMember(id: string) {
    return this.execute<any>(
      `/v3/{orgSlug}/members/${id}`,
      () => this.scrymeServer.members.getMember(id),
      false,
    );
  }

  async updateMember(id: string, dto: any) {
    return this.execute<any>(
      `/v3/{orgSlug}/members/${id}`,
      () => this.scrymeServer.members.updateMember(id, dto as any),
      true,
    );
  }

  async deleteMember(id: string) {
    return this.execute<any>(
      `/v3/{orgSlug}/members/${id}`,
      () => this.scrymeServer.members.deleteMember(id),
      true,
    );
  }

  // --- Shifts ---

  async createShift(
    memberId: string,
    dto: { startTime: string; endTime: string },
  ) {
    const dayOfWeek = isNaN(new Date(dto.startTime).getTime())
      ? 1
      : new Date(dto.startTime).getDay();

    return this.execute<any>(
      `/v3/{orgSlug}/services/staff/${memberId}/shifts`,
      () => this.scrymeServer.catalog.createShift(memberId, {
        ...dto,
        dayOfWeek,
      } as any),
      true,
    );
  }

  async getStaffShifts(memberId: string) {
    return this.execute<any[]>(
      `/v3/{orgSlug}/services/staff/${memberId}/shifts`,
      () => this.scrymeServer.catalog.getStaffShifts(memberId),
      false,
    );
  }

  async addBreak(shiftId: string, dto: { startTime: string; endTime: string }) {
    return this.execute<any>(
      `/v3/{orgSlug}/services/shifts/${shiftId}/breaks`,
      () => this.scrymeServer.catalog.addBreak(shiftId, dto as any),
      true,
    );
  }

  // --- Bookings ---

  async createBooking(dto: {
    serviceId: string;
    customerId: string;
    scheduledStartTime: string;
    staffIds?: string[];
  }) {
    return this.execute<any>(
      "/v3/{orgSlug}/services/bookings",
      () => this.scrymeServer.catalog.createBooking(dto as any),
      true,
    );
  }

  async listBookings() {
    return this.execute<any[]>(
      "/v3/{orgSlug}/services/bookings",
      () => this.scrymeServer.catalog.getBookings(),
      false,
    );
  }

  async getBooking(id: string) {
    return this.execute<any>(
      `/v3/{orgSlug}/services/bookings/${id}`,
      () => this.scrymeServer.catalog.getBooking(id),
      false,
    );
  }

  async updateBookingStatus(id: string, dto: { status: string }) {
    return this.execute<any>(
      `/v3/{orgSlug}/services/bookings/${id}/status`,
      () => this.scrymeServer.catalog.updateBookingStatus(id, dto as any),
      true,
    );
  }

  async completeBooking(id: string, dto: any) {
    return this.execute<any>(
      `/v3/{orgSlug}/services/bookings/${id}/complete`,
      () => this.scrymeServer.catalog.completeBooking(id, dto as any),
      true,
    );
  }

  // --- Catalog ---

  async listCatalogProducts() {
    return this.execute<any[]>(
      "/v3/{orgSlug}/catalog/products",
      () => this.scrymeServer.catalog.getProducts(),
      false,
    );
  }

  async listCatalogServices() {
    return this.execute<any[]>(
      "/v3/{orgSlug}/catalog/services",
      () => this.scrymeServer.catalog.getServices(),
      false,
    );
  }

  // --- Orders ---

  async createOrder(dto: {
    customerId?: string;
    locationId: string;
    items?: { variantId: string; quantity: number; unitPrice?: number }[];
    services?: {
      serviceId: string;
      scheduledStartTime: string;
      scheduledEndTime?: string;
      staffIds?: string[];
      resourceIds?: string[];
      notes?: string;
    }[];
    shippingAddress?: any;
    channel?: string;
    notes?: string;
  }) {
    return this.execute<any>(
      "/v3/{orgSlug}/orders",
      () => this.scrymeServer.orders.createOrder(dto as any),
      true,
    );
  }

  async listOrders() {
    return this.execute<any[]>(
      "/v3/{orgSlug}/orders",
      () => this.scrymeServer.orders.getOrders(),
      false,
    );
  }

  async updateOrderStatus(id: string, dto: { status: string }) {
    return this.execute<any>(
      `/v3/{orgSlug}/orders/${id}/status`,
      () => this.scrymeServer.orders.updateStatus(id, dto as any),
      true,
    );
  }
}
