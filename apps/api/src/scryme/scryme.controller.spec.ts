import { Test, TestingModule } from "@nestjs/testing";
import { ScrymeController } from "./scryme.controller";
import { ScrymeService } from "./scryme.service";
import { BetterAuthGuard } from "../auth/better-auth.guard";
import { ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";

describe("ScrymeController Unit Tests", () => {
  let controller: ScrymeController;
  let service: ScrymeService;

  const mockScrymeService = {
    registerCustomer: jest.fn(),
    listCustomers: jest.fn(),
    getCustomer: jest.fn(),
    updateCustomer: jest.fn(),
    deleteCustomer: jest.fn(),
    createMember: jest.fn(),
    listMembers: jest.fn(),
    getMember: jest.fn(),
    updateMember: jest.fn(),
    deleteMember: jest.fn(),
    createShift: jest.fn(),
    getStaffShifts: jest.fn(),
    addBreak: jest.fn(),
  };

  const mockBetterAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrymeController],
      providers: [
        {
          provide: ScrymeService,
          useValue: mockScrymeService,
        },
      ],
    })
      .overrideGuard(BetterAuthGuard)
      .useValue(mockBetterAuthGuard)
      .compile();

    controller = module.get<ScrymeController>(ScrymeController);
    service = module.get<ScrymeService>(ScrymeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Customers", () => {
    it("should list customers", async () => {
      const customers = [{ id: "cust-1", name: "John Doe" }];
      mockScrymeService.listCustomers.mockResolvedValue(customers);

      const result = await controller.listCustomers();
      expect(result).toEqual(customers);
      expect(service.listCustomers).toHaveBeenCalledTimes(1);
    });

    it("should register a customer", async () => {
      const dto = { name: "John Doe", email: "john@example.com" };
      const response = { id: "cust-1", ...dto };
      mockScrymeService.registerCustomer.mockResolvedValue(response);

      const result = await controller.registerCustomer(dto);
      expect(result).toEqual(response);
      expect(service.registerCustomer).toHaveBeenCalledWith(dto);
    });

    it("should get a customer by id", async () => {
      const customer = { id: "cust-1", name: "John" };
      mockScrymeService.getCustomer.mockResolvedValue(customer);

      const result = await controller.getCustomer("cust-1");
      expect(result).toEqual(customer);
      expect(service.getCustomer).toHaveBeenCalledWith("cust-1");
    });

    it("should update a customer", async () => {
      const dto = { name: "John Updated" };
      mockScrymeService.updateCustomer.mockResolvedValue({
        id: "cust-1",
        ...dto,
      });

      const result = await controller.updateCustomer("cust-1", dto);
      expect(result).toEqual({ id: "cust-1", ...dto });
      expect(service.updateCustomer).toHaveBeenCalledWith("cust-1", dto);
    });

    it("should delete a customer", async () => {
      mockScrymeService.deleteCustomer.mockResolvedValue({ success: true });

      const result = await controller.deleteCustomer("cust-1");
      expect(result).toEqual({ success: true });
      expect(service.deleteCustomer).toHaveBeenCalledWith("cust-1");
    });
  });

  describe("Staff / Members", () => {
    it("should create a staff member", async () => {
      const dto = {
        name: "Alice",
        email: "alice@example.com",
        role: "EMPLOYEE",
      };
      mockScrymeService.createMember.mockResolvedValue({ id: "m-1", ...dto });

      const result = await controller.createMember(dto);
      expect(result).toEqual({ id: "m-1", ...dto });
      expect(service.createMember).toHaveBeenCalledWith(dto);
    });

    it("should list members", async () => {
      const members = [{ id: "m-1", name: "Alice" }];
      mockScrymeService.listMembers.mockResolvedValue(members);

      const result = await controller.listMembers();
      expect(result).toEqual(members);
      expect(service.listMembers).toHaveBeenCalledTimes(1);
    });
  });

  describe("Shifts & Breaks", () => {
    it("should create a shift", async () => {
      const dto = {
        startTime: "2026-10-10T08:00:00Z",
        endTime: "2026-10-10T16:00:00Z",
      };
      mockScrymeService.createShift.mockResolvedValue({
        id: "shift-1",
        ...dto,
      });

      const result = await controller.createShift("m-1", dto);
      expect(result).toEqual({ id: "shift-1", ...dto });
      expect(service.createShift).toHaveBeenCalledWith("m-1", dto);
    });

    it("should get shifts", async () => {
      const shifts = [{ id: "shift-1" }];
      mockScrymeService.getStaffShifts.mockResolvedValue(shifts);

      const result = await controller.getStaffShifts("m-1");
      expect(result).toEqual(shifts);
      expect(service.getStaffShifts).toHaveBeenCalledWith("m-1");
    });

    it("should add a break", async () => {
      const dto = {
        startTime: "2026-10-10T12:00:00Z",
        endTime: "2026-10-10T13:00:00Z",
      };
      mockScrymeService.addBreak.mockResolvedValue({ id: "break-1", ...dto });

      const result = await controller.addBreak("shift-1", dto);
      expect(result).toEqual({ id: "break-1", ...dto });
      expect(service.addBreak).toHaveBeenCalledWith("shift-1", dto);
    });
  });
});
