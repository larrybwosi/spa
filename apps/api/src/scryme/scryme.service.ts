import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";

@Injectable()
export class ScrymeService {
  private readonly logger = new Logger(ScrymeService.name);

  private get clientId(): string | undefined {
    return process.env.SCRYME_CLIENT_ID;
  }

  private get clientSecret(): string | undefined {
    return process.env.SCRYME_CLIENT_SECRET;
  }

  private get apiKey(): string {
    return process.env.SCRYME_API_KEY || "test-scryme-api-key";
  }

  private get orgSlug(): string {
    return process.env.SCRYME_ORG_SLUG || "spa-test-org";
  }

  private get apiUrl(): string {
    return process.env.SCRYME_API_URL || "https://api.scryme.tech";
  }

  private cachedToken: string | null = null;
  private tokenExpiresAt: number | null = null; // timestamp in ms

  /**
   * Helper to parse error details from failed HTTP responses.
   * Handles JSON payload, plain text, or default status text.
   */
  private async parseErrorBody(response: Response): Promise<string> {
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const json = await response.json();
        return (
          json.message ||
          json.error_description ||
          json.error ||
          JSON.stringify(json)
        );
      }
      const text = await response.text();
      return text || response.statusText;
    } catch {
      return response.statusText || "Unknown API Error";
    }
  }

  /**
   * Helper to handle network / unexpected errors thrown during fetch.
   */
  private handleNetworkError(error: unknown, contextMessage: string): never {
    if (error instanceof HttpException) {
      throw error;
    }
    const message =
      error instanceof Error ? error.message : "Network/Connection error";
    this.logger.error(`${contextMessage}: ${message}`);
    throw new HttpException(
      `${contextMessage}: ${message}`,
      HttpStatus.BAD_GATEWAY,
    );
  }

  /**
   * Exchanges Client ID & Client Secret for an Access Token at /v3/auth/token
   */
  async fetchAccessToken(forceRefresh = false): Promise<string> {
    const clientId = this.clientId;
    const clientSecret = this.clientSecret;

    if (!clientId || !clientSecret) {
      this.logger.debug(
        "SCRYME_CLIENT_ID or SCRYME_CLIENT_SECRET not defined. Using apiKey instead.",
      );
      return this.apiKey;
    }

    // Return cached token if valid and not expiring in the next 10 seconds
    if (
      !forceRefresh &&
      this.cachedToken &&
      this.tokenExpiresAt &&
      this.tokenExpiresAt > Date.now() + 10000
    ) {
      return this.cachedToken;
    }

    const url = `${this.apiUrl}/v3/auth/token`;
    try {
      this.logger.debug(`Exchanging client credentials at: ${url}`);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, clientSecret }),
      });

      if (!response.ok) {
        const errorDetails = await this.parseErrorBody(response);
        this.logger.error(
          `Scryme Token Exchange error (${response.status}): ${errorDetails}`,
        );
        throw new HttpException(
          `Scryme Token Exchange failed: ${errorDetails}`,
          response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const resp = (await response.json()) as {
        data: {
          accessToken: string;
          tokenType: string;
          expiresIn: number;
        };
      };
      const data = resp.data;

      if (!data.accessToken) {
        throw new HttpException(
          "Scryme Auth API did not return an access token",
          HttpStatus.BAD_GATEWAY,
        );
      }

      this.cachedToken = data.accessToken;
      this.tokenExpiresAt = Date.now() + (data.expiresIn || 3600) * 1000;

      this.logger.debug("Successfully exchanged Scryme OAuth2 Access Token");
      return this.cachedToken;
    } catch (error) {
      this.handleNetworkError(
        error,
        "Scryme Token Exchange connection failure",
      );
    }
  }

  /**
   * Universal fetch request helper to query the Scryme API.
   * Includes automatic retry on 401 Unauthorized errors.
   */
  async request<T>(
    method: string,
    path: string,
    body?: any,
    isRetry = false,
  ): Promise<T> {
    const resolvedPath = path.replace("{orgSlug}", this.orgSlug);
    const url = `${this.apiUrl}${resolvedPath}`;

    const token = await this.fetchAccessToken(isRetry);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      this.logger.debug(`Sending ${method} request to Scryme: ${url}`);
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      // Handle 401 Unauthorized (invalid/expired token) with a single retry
      if (response.status === HttpStatus.UNAUTHORIZED && !isRetry) {
        this.logger.warn(
          "Received 401 Unauthorized from Scryme. Retrying with a refreshed token...",
        );
        this.cachedToken = null;
        this.tokenExpiresAt = null;
        return this.request<T>(method, path, body, true);
      }

      if (!response.ok) {
        const errorDetails = await this.parseErrorBody(response);
        this.logger.error(
          `Scryme API error (${response.status}): ${errorDetails}`,
        );
        throw new HttpException(
          `Scryme API error: ${errorDetails}`,
          response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Handle empty response bodies (e.g., 204 No Content or empty DELETE responses)
      if (response.status === HttpStatus.NO_CONTENT) {
        return {} as T;
      }

      const text = await response.text();
      if (!text) {
        return {} as T;
      }

      try {
        return JSON.parse(text) as T;
      } catch (jsonError) {
        this.logger.error(`Failed to parse response JSON from ${url}`);
        throw new HttpException(
          "Invalid JSON response from Scryme API",
          HttpStatus.BAD_GATEWAY,
        );
      }
    } catch (error) {
      this.handleNetworkError(error, "Scryme connection failure");
    }
  }

  // --- Customers ---

  async registerCustomer(dto: {
    name: string;
    email: string;
    phone?: string;
    zitadelUserId?: string;
  }) {
    return this.request<any>("POST", "/v3/{orgSlug}/customers/register", dto);
  }

  async listCustomers() {
    return this.request<any[]>("GET", "/v3/{orgSlug}/customers");
  }

  async getCustomer(id: string) {
    return this.request<any>("GET", `/v3/{orgSlug}/customers/${id}`);
  }

  async updateCustomer(id: string, dto: any) {
    return this.request<any>("PATCH", `/v3/{orgSlug}/customers/${id}`, dto);
  }

  async deleteCustomer(id: string) {
    return this.request<any>("DELETE", `/v3/{orgSlug}/customers/${id}`);
  }

  // --- Staff / Members ---

  async createMember(dto: { name: string; email: string; role: string }) {
    return this.request<any>("POST", "/v3/{orgSlug}/members", dto);
  }

  async listMembers() {
    return this.request<any[]>("GET", "/v3/{orgSlug}/members");
  }

  async getMember(id: string) {
    return this.request<any>("GET", `/v3/{orgSlug}/members/${id}`);
  }

  async updateMember(id: string, dto: any) {
    return this.request<any>("PATCH", `/v3/{orgSlug}/members/${id}`, dto);
  }

  async deleteMember(id: string) {
    return this.request<any>("DELETE", `/v3/{orgSlug}/members/${id}`);
  }

  // --- Shifts ---

  async createShift(
    memberId: string,
    dto: { startTime: string; endTime: string },
  ) {
    return this.request<any>(
      "POST",
      `/v3/{orgSlug}/services/staff/${memberId}/shifts`,
      dto,
    );
  }

  async getStaffShifts(memberId: string) {
    return this.request<any[]>(
      "GET",
      `/v3/{orgSlug}/services/staff/${memberId}/shifts`,
    );
  }

  async addBreak(shiftId: string, dto: { startTime: string; endTime: string }) {
    return this.request<any>(
      "POST",
      `/v3/{orgSlug}/services/shifts/${shiftId}/breaks`,
      dto,
    );
  }

  // --- Bookings ---

  async createBooking(dto: {
    serviceId: string;
    customerId: string;
    scheduledStartTime: string;
    staffIds?: string[];
  }) {
    return this.request<any>("POST", "/v3/{orgSlug}/services/bookings", dto);
  }

  async listBookings() {
    return this.request<any[]>("GET", "/v3/{orgSlug}/services/bookings");
  }

  async getBooking(id: string) {
    return this.request<any>("GET", `/v3/{orgSlug}/services/bookings/${id}`);
  }

  async updateBookingStatus(id: string, dto: { status: string }) {
    return this.request<any>(
      "PATCH",
      `/v3/{orgSlug}/services/bookings/${id}/status`,
      dto,
    );
  }

  async completeBooking(id: string, dto: any) {
    return this.request<any>(
      "PATCH",
      `/v3/{orgSlug}/services/bookings/${id}/complete`,
      dto,
    );
  }

  // --- Catalog ---

  async listCatalogProducts() {
    return this.request<any[]>("GET", "/v3/{orgSlug}/catalog/products");
  }

  async listCatalogServices() {
    return this.request<any[]>("GET", "/v3/{orgSlug}/catalog/services");
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
    return this.request<any>("POST", "/v3/{orgSlug}/orders", dto);
  }

  async listOrders() {
    return this.request<any[]>("GET", "/v3/{orgSlug}/orders");
  }

  async updateOrderStatus(id: string, dto: { status: string }) {
    return this.request<any>("POST", `/v3/{orgSlug}/orders/${id}/status`, dto);
  }
}
