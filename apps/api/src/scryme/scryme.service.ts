import { Injectable } from "@nestjs/common";
import { ScrymeBaseService } from "./scryme-base.service";
import { ScrymeCustomersService } from "./scryme-customers.service";
import { ScrymeMembersService } from "./scryme-members.service";
import { ScrymeShiftsService } from "./scryme-shifts.service";
import { ScrymeBookingsService } from "./scryme-bookings.service";
import { ScrymeCatalogService } from "./scryme-catalog.service";
import { ScrymeOrdersService } from "./scryme-orders.service";
import { ScrymeServerSDK } from "@scryme/sdk/server";
import { ScrymeClientSDK } from "@scryme/sdk/client";

@Injectable()
export class ScrymeService {
  constructor(
    private readonly base: ScrymeBaseService,
    private readonly customersService: ScrymeCustomersService,
    private readonly membersService: ScrymeMembersService,
    private readonly shiftsService: ScrymeShiftsService,
    private readonly bookingsService: ScrymeBookingsService,
    private readonly catalogService: ScrymeCatalogService,
    private readonly ordersService: ScrymeOrdersService,
  ) {}

  public get scrymeServer(): ScrymeServerSDK {
    return this.base.scrymeServer;
  }

  public get scrymeClient(): ScrymeClientSDK {
    return this.base.scrymeClient;
  }

  // --- Delegate Helper (if needed by tests/external callers) ---
  async execute<T>(
    cachePath: string,
    action: () => Promise<{ data: T }>,
    isMutation = false,
  ): Promise<T> {
    return this.base.execute(cachePath, action, isMutation);
  }

  // --- Customers ---

  async registerCustomer(
    dto: Parameters<ScrymeServerSDK["admin"]["registerCustomer"]>[0],
  ) {
    return this.customersService.registerCustomer(dto);
  }

  async listCustomers() {
    return this.customersService.listCustomers();
  }

  async getCustomer(id: string) {
    return this.customersService.getCustomer(id);
  }

  async updateCustomer(
    id: string,
    dto: Parameters<ScrymeServerSDK["admin"]["updateCustomer"]>[1],
  ) {
    return this.customersService.updateCustomer(id, dto);
  }

  async deleteCustomer(id: string) {
    return this.customersService.deleteCustomer(id);
  }

  // --- Staff / Members ---

  async createMember(
    dto: Parameters<ScrymeServerSDK["members"]["createMember"]>[0],
  ) {
    return this.membersService.createMember(dto);
  }

  async listMembers() {
    return this.membersService.listMembers();
  }

  async getMember(id: string) {
    return this.membersService.getMember(id);
  }

  async updateMember(
    id: string,
    dto: Parameters<ScrymeServerSDK["members"]["updateMember"]>[1],
  ) {
    return this.membersService.updateMember(id, dto);
  }

  async deleteMember(id: string) {
    return this.membersService.deleteMember(id);
  }

  // --- Shifts ---

  async createShift(
    memberId: string,
    dto: Omit<
      Parameters<ScrymeServerSDK["catalog"]["createShift"]>[1],
      "dayOfWeek"
    > & { startTime: string },
  ) {
    return this.shiftsService.createShift(memberId, dto);
  }

  async getStaffShifts(memberId: string) {
    return this.shiftsService.getStaffShifts(memberId);
  }

  async addBreak(
    shiftId: string,
    dto: Parameters<ScrymeServerSDK["catalog"]["addBreak"]>[1],
  ) {
    return this.shiftsService.addBreak(shiftId, dto);
  }

  // --- Bookings ---

  async createBooking(
    dto: Parameters<ScrymeServerSDK["catalog"]["createBooking"]>[0],
  ) {
    return this.bookingsService.createBooking(dto);
  }

  async listBookings() {
    return this.bookingsService.listBookings();
  }

  async getBooking(id: string) {
    return this.bookingsService.getBooking(id);
  }

  async updateBookingStatus(
    id: string,
    dto: Parameters<ScrymeServerSDK["catalog"]["updateBookingStatus"]>[1],
  ) {
    return this.bookingsService.updateBookingStatus(id, dto);
  }

  async completeBooking(
    id: string,
    dto: Parameters<ScrymeServerSDK["catalog"]["completeBooking"]>[1],
  ) {
    return this.bookingsService.completeBooking(id, dto);
  }

  // --- Catalog ---

  async listCatalogProducts() {
    return this.catalogService.listCatalogProducts();
  }

  async listCatalogServices() {
    return this.catalogService.listCatalogServices();
  }

  // --- Orders ---

  async createOrder(
    dto: Parameters<ScrymeServerSDK["orders"]["createOrder"]>[0],
  ) {
    return this.ordersService.createOrder(dto);
  }

  async listOrders() {
    return this.ordersService.listOrders();
  }

  async updateOrderStatus(
    id: string,
    dto: Parameters<ScrymeServerSDK["orders"]["updateStatus"]>[1],
  ) {
    return this.ordersService.updateOrderStatus(id, dto);
  }
}
