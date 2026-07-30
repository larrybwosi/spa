import { Injectable, Logger, HttpException, HttpStatus } from "@nestjs/common";

@Injectable()
export class ScrymeService {
  private readonly logger = new Logger(ScrymeService.name);

  private get apiKey(): string {
    return process.env.SCRYME_API_KEY || "test-scryme-api-key";
  }

  private get orgSlug(): string {
    return process.env.SCRYME_ORG_SLUG || "spa-test-org";
  }

  private get apiUrl(): string {
    return process.env.SCRYME_API_URL || "https://api.scryme.tech";
  }

  /**
   * Universal fetch request helper to query the Scryme API.
   */
  async request<T>(method: string, path: string, body?: any): Promise<T> {
    // Replace {orgSlug} placeholder dynamically if it exists in path
    const resolvedPath = path.replace("{orgSlug}", this.orgSlug);
    const url = `${this.apiUrl}${resolvedPath}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    try {
      this.logger.debug(`Sending ${method} request to Scryme: ${url}`);
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        let errorDetails = "";
        try {
          errorDetails = await response.text();
        } catch {
          // Ignore error reading response text
        }
        this.logger.error(
          `Scryme API error (${response.status}): ${errorDetails}`,
        );
        throw new HttpException(
          `Scryme API error: ${errorDetails || response.statusText}`,
          response.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Check if response has content (some DELETE / status endpoints return empty body or 204)
      const text = await response.text();
      return text ? (JSON.parse(text) as T) : ({} as T);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Failed to connect to Scryme API: ${error.message}`);
      throw new HttpException(
        `Scryme connection failure: ${error.message}`,
        HttpStatus.BAD_GATEWAY,
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
}
