import "dotenv/config";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../src/prisma.service";
import { AuthService } from "../src/auth/auth.service";
import { ProductsService } from "../src/products/products.service";
import { ServicesService } from "../src/services/services.service";
import { BookingsService } from "../src/bookings/bookings.service";
import { OrdersService } from "../src/orders/orders.service";
import { ScrymeService } from "../src/scryme/scryme.service";
import { Role, BookingStatus } from "@prisma/client";
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";

describe("Spa Platform End-to-End Core Logic Tests", () => {
  let module: TestingModule;
  let prisma: PrismaService;
  let authService: AuthService;
  let productsService: ProductsService;
  let servicesService: ServicesService;
  let bookingsService: BookingsService;
  let ordersService: OrdersService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        PrismaService,
        AuthService,
        ProductsService,
        ServicesService,
        BookingsService,
        OrdersService,
        {
          provide: ScrymeService,
          useValue: {
            registerCustomer: jest.fn().mockResolvedValue({ id: 'mock-customer-id', success: true }),
            createMember: jest.fn().mockResolvedValue({ id: 'mock-member-id', success: true }),
            createBooking: jest.fn().mockRejectedValue(new Error('Scryme offline fallback')),
            getBooking: jest.fn().mockRejectedValue(new Error('Scryme offline fallback')),
            listBookings: jest.fn().mockRejectedValue(new Error('Scryme offline fallback')),
            updateBookingStatus: jest.fn().mockRejectedValue(new Error('Scryme offline fallback')),
            createOrder: jest.fn().mockRejectedValue(new Error('Scryme offline fallback')),
            listOrders: jest.fn().mockRejectedValue(new Error('Scryme offline fallback')),
          },
        },
      ],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    authService = module.get<AuthService>(AuthService);
    productsService = module.get<ProductsService>(ProductsService);
    servicesService = module.get<ServicesService>(ServicesService);
    bookingsService = module.get<BookingsService>(BookingsService);
    ordersService = module.get<OrdersService>(OrdersService);

    // Call onModuleInit manually or enableShutdownHooks
    await module.init();
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });

  beforeEach(async () => {
    // Clear the database tables before each test to guarantee test isolation
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.user.deleteMany({});
  });

  describe("Authentication Module tests", () => {
    it("should register a new client user", async () => {
      const user = await authService.signUp({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        role: Role.CLIENT,
      });

      expect(user).toBeDefined();
      expect(user.name).toBe("John Doe");
      expect(user.email).toBe("john@example.com");
      expect(user.role).toBe(Role.CLIENT);

      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      expect(dbUser).toBeDefined();
    });

    it("should prevent registration with duplicate email address", async () => {
      await authService.signUp({
        name: "User One",
        email: "duplicate@example.com",
        password: "password123",
      });

      await expect(
        authService.signUp({
          name: "User Two",
          email: "duplicate@example.com",
          password: "anotherpassword",
        }),
      ).rejects.toThrow(ConflictException);
    });

    it("should sign in registered user and generate session token", async () => {
      await authService.signUp({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "securepassword",
        role: Role.STAFF,
      });

      const result = await authService.signIn({
        email: "jane@example.com",
        password: "securepassword",
      });

      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.user.name).toBe("Jane Doe");
      expect(result.user.role).toBe(Role.STAFF);

      // Verify session exists in database
      const dbSession = await prisma.session.findUnique({
        where: { token: result.token },
      });
      expect(dbSession).toBeDefined();
      expect(dbSession?.userId).toBe(result.session.userId);
    });

    it("should reject sign-in with incorrect password", async () => {
      await authService.signUp({
        name: "Test Account",
        email: "test@example.com",
        password: "correctpassword",
      });

      await expect(
        authService.signIn({
          email: "test@example.com",
          password: "wrongpassword",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should successfully validate session tokens and destroy on sign-out", async () => {
      const user = await authService.signUp({
        name: "User Session",
        email: "session@example.com",
        password: "password123",
      });

      const { token } = await authService.signIn({
        email: "session@example.com",
        password: "password123",
      });

      // Token should validate successfully
      const validatedUser = await authService.validateSession(token);
      expect(validatedUser).toBeDefined();
      expect(validatedUser?.id).toBe(user.id);

      // Log out
      await authService.signOut(token);

      // Token should now be invalid
      const invalidatedUser = await authService.validateSession(token);
      expect(invalidatedUser).toBeNull();
    });
  });

  describe("Products CRUD Module tests", () => {
    it("should create and retrieve products", async () => {
      const product = await productsService.create({
        name: "Lavender Essential Oil",
        description: "Therapeutic grade lavender oil",
        price: 15.99,
        stock: 50,
      });

      expect(product).toBeDefined();
      expect(product.id).toBeDefined();
      expect(product.name).toBe("Lavender Essential Oil");

      const retrieved = await productsService.getOne(product.id);
      expect(retrieved.price).toBe(15.99);
      expect(retrieved.stock).toBe(50);
    });

    it("should prevent creating products with negative stock or price", async () => {
      await expect(
        productsService.create({
          name: "Invalid Product",
          price: -5,
          stock: 10,
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        productsService.create({
          name: "Invalid Product 2",
          price: 10,
          stock: -1,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should update product details correctly", async () => {
      const product = await productsService.create({
        name: "Clay Mask",
        price: 25.0,
        stock: 15,
      });

      const updated = await productsService.update(product.id, {
        price: 22.5,
        stock: 20,
      });

      expect(updated.price).toBe(22.5);
      expect(updated.stock).toBe(20);
    });

    it("should delete products", async () => {
      const product = await productsService.create({
        name: "To Delete",
        price: 5.0,
        stock: 1,
      });

      await productsService.delete(product.id);

      await expect(productsService.getOne(product.id)).rejects.toThrow();
    });
  });

  describe("Services CRUD Module tests", () => {
    it("should create and retrieve services", async () => {
      const service = await servicesService.create({
        name: "Hot Stone Massage",
        description: "Deeply relaxing massage with heated stones",
        duration: 90,
        price: 120.0,
      });

      expect(service).toBeDefined();
      expect(service.id).toBeDefined();
      expect(service.name).toBe("Hot Stone Massage");
      expect(service.duration).toBe(90);

      const retrieved = await servicesService.getOne(service.id);
      expect(retrieved.price).toBe(120.0);
    });

    it("should prevent creating services with negative price or zero duration", async () => {
      await expect(
        servicesService.create({
          name: "Invalid Service",
          duration: 0,
          price: 50,
        }),
      ).rejects.toThrow(BadRequestException);

      await expect(
        servicesService.create({
          name: "Invalid Service 2",
          duration: 30,
          price: -10,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("Bookings Module tests", () => {
    let clientUser: any;
    let staffUser: any;
    let service: any;

    beforeEach(async () => {
      clientUser = await authService.signUp({
        name: "Amy Client",
        email: "amy@example.com",
        password: "password123",
        role: Role.CLIENT,
      });

      staffUser = await authService.signUp({
        name: "Therapist John",
        email: "john-therapist@example.com",
        password: "password123",
        role: Role.STAFF,
      });

      service = await servicesService.create({
        name: "Swedish Massage",
        duration: 60,
        price: 80.0,
      });
    });

    it("should create a booking in the future with a valid staff therapist", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const booking = await bookingsService.create(clientUser, {
        serviceId: service.id,
        staffId: staffUser.id,
        dateTime: tomorrow.toISOString(),
      });

      expect(booking).toBeDefined();
      expect(booking.clientId).toBe(clientUser.id);
      expect(booking.staffId).toBe(staffUser.id);
      expect(booking.status).toBe(BookingStatus.PENDING);
    });

    it("should prevent booking with past dates", async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      await expect(
        bookingsService.create(clientUser, {
          serviceId: service.id,
          staffId: staffUser.id,
          dateTime: yesterday.toISOString(),
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should prevent booking with an invalid therapist (e.g. another client)", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Try to book service with another client instead of therapist
      const anotherClient = await authService.signUp({
        name: "Another Client",
        email: "client2@example.com",
        password: "password123",
        role: Role.CLIENT,
      });

      await expect(
        bookingsService.create(clientUser, {
          serviceId: service.id,
          staffId: anotherClient.id,
          dateTime: tomorrow.toISOString(),
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it("should allow clients to cancel booking, and staff to update to any status", async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const booking = await bookingsService.create(clientUser, {
        serviceId: service.id,
        staffId: staffUser.id,
        dateTime: tomorrow.toISOString(),
      });

      // Client cancels booking
      const cancelledBooking = await bookingsService.updateStatus(
        booking.id,
        clientUser,
        BookingStatus.CANCELLED,
      );
      expect(cancelledBooking.status).toBe(BookingStatus.CANCELLED);

      // Clients should not be able to confirm or complete bookings
      await expect(
        bookingsService.updateStatus(
          booking.id,
          clientUser,
          BookingStatus.CONFIRMED,
        ),
      ).rejects.toThrow(ForbiddenException);

      // Staff should be able to confirm booking
      const confirmedBooking = await bookingsService.updateStatus(
        booking.id,
        staffUser,
        BookingStatus.CONFIRMED,
      );
      expect(confirmedBooking.status).toBe(BookingStatus.CONFIRMED);
    });

    it('should handle remote-only booking when Scryme is online (happy path)', async () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const mockScryme = module.get<ScrymeService>(ScrymeService);
      jest.spyOn(mockScryme, 'createBooking').mockResolvedValueOnce({
        id: 'remote-booking-999',
        status: 'PENDING',
      });

      const booking = await bookingsService.create(clientUser, {
        serviceId: service.id,
        staffId: staffUser.id,
        dateTime: tomorrow.toISOString(),
      });

      expect(booking).toBeDefined();
      expect(booking.id).toBe('remote-booking-999');
      expect(booking.clientId).toBe(clientUser.id);
      expect(booking.status).toBe(BookingStatus.PENDING);

      // Verify it was NOT persisted to local DB
      const dbBooking = await prisma.booking.findUnique({ where: { id: booking.id } });
      expect(dbBooking).toBeNull();
    });
  });

  describe("Orders and Inventory Module tests", () => {
    let clientUser: any;
    let product1: any;
    let product2: any;

    beforeEach(async () => {
      clientUser = await authService.signUp({
        name: "Buyer Client",
        email: "buyer@example.com",
        password: "password123",
        role: Role.CLIENT,
      });

      product1 = await productsService.create({
        name: "Moisturizer",
        price: 30.0,
        stock: 10,
      });

      product2 = await productsService.create({
        name: "Shampoo",
        price: 15.0,
        stock: 5,
      });
    });

    it("should place a multi-item product order, decrementing stock and calculating total correctly", async () => {
      const order = await ordersService.create(clientUser, {
        items: [
          { productId: product1.id, quantity: 2 },
          { productId: product2.id, quantity: 1 },
        ],
      });

      expect(order).toBeDefined();
      expect(order.clientId).toBe(clientUser.id);
      expect(order.totalPrice).toBe(75.0); // (30*2) + (15*1) = 75

      // Verify product stocks were decremented
      const p1 = await productsService.getOne(product1.id);
      expect(p1.stock).toBe(8); // 10 - 2

      const p2 = await productsService.getOne(product2.id);
      expect(p2.stock).toBe(4); // 5 - 1
    });

    it("should prevent order placement if requested stock is not available", async () => {
      await expect(
        ordersService.create(clientUser, {
          items: [
            { productId: product2.id, quantity: 6 }, // Only 5 available
          ],
        }),
      ).rejects.toThrow(BadRequestException);

      // Ensure stock was not decremented due to atomic transactional rollback
      const p2 = await productsService.getOne(product2.id);
      expect(p2.stock).toBe(5);
    });

    it('should handle remote-only order when Scryme is online (happy path)', async () => {
      const mockScryme = module.get<ScrymeService>(ScrymeService);
      jest.spyOn(mockScryme, 'createOrder').mockResolvedValueOnce({
        id: 'remote-order-888',
        status: 'PENDING',
        totalAmount: 45.0,
        createdAt: new Date().toISOString(),
      });

      const order = await ordersService.create(clientUser, {
        items: [
          { productId: product1.id, quantity: 1 },
          { productId: product2.id, quantity: 1 },
        ],
      });

      expect(order).toBeDefined();
      expect(order.id).toBe('remote-order-888');
      expect(order.clientId).toBe(clientUser.id);
      expect(order.totalPrice).toBe(45.0); // 30 + 15 = 45

      // Verify product stocks were NOT decremented since we did not persist locally
      const p1 = await productsService.getOne(product1.id);
      expect(p1.stock).toBe(10); // Still 10

      // Verify order was NOT persisted to local DB
      const dbOrder = await prisma.order.findUnique({ where: { id: order.id } });
      expect(dbOrder).toBeNull();
    });
  });
});
