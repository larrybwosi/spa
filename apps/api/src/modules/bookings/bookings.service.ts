import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { ScrymeService } from "@/integrations/scryme/scryme.service";
import { ServicesService } from "@/modules/services/services.service";
import { BookingStatus, User, Role } from "@prisma/client";

@Injectable()
export class BookingsService implements OnModuleInit, OnModuleDestroy {
  private failedBookingsQueue: { id: string; payload: any }[] = [];
  private queueInterval: any;

  constructor(
    private prisma: PrismaService,
    private scrymeService: ScrymeService,
    private servicesService: ServicesService,
  ) {}

  onModuleInit() {
    this.queueInterval = setInterval(() => this.processQueue(), 30000);
    if (this.queueInterval && typeof this.queueInterval.unref === "function") {
      this.queueInterval.unref();
    }
  }

  onModuleDestroy() {
    if (this.queueInterval) {
      clearInterval(this.queueInterval);
    }
  }

  private async processQueue() {
    if (this.failedBookingsQueue.length === 0) return;
    const nextQueue = [];
    for (const item of this.failedBookingsQueue) {
      try {
        await this.scrymeService.createBooking(item.payload);
      } catch {
        nextQueue.push(item);
      }
    }
    this.failedBookingsQueue = nextQueue;
  }

  private async mapScrymeBooking(booking: any) {
    const clientId = booking.customerId;
    const serviceId = booking.serviceId;
    const staffId =
      booking.staffIds && booking.staffIds.length > 0
        ? booking.staffIds[0]
        : "";

    const [client, service, staff] = await Promise.all([
      this.prisma.user
        .findUnique({ where: { id: clientId } })
        .catch(() => null),
      this.servicesService.getOne(serviceId).catch(() => null),
      this.prisma.user.findUnique({ where: { id: staffId } }).catch(() => null),
    ]);

    return {
      id: booking.id,
      clientId,
      serviceId,
      staffId,
      dateTime: new Date(booking.scheduledStartTime),
      status: booking.status as BookingStatus,
      createdAt: new Date(booking.createdAt || Date.now()),
      updatedAt: new Date(booking.updatedAt || Date.now()),
      client: client || { id: clientId, name: "Unknown Client", email: "" },
      service: service || {
        id: serviceId,
        name: "Unknown Service",
        price: 0,
        duration: 60,
      },
      staff: staff || { id: staffId, name: "Unknown Staff", email: "" },
    };
  }

  async getAll(user: User) {
    try {
      const scrymeBookings = (await this.scrymeService.listBookings()) as any[];
      const mappedBookings = await Promise.all(
        scrymeBookings.map((b: any) => this.mapScrymeBooking(b)),
      );

      if (user.role === Role.ADMIN) {
        return mappedBookings.sort(
          (a: any, b: any) => b.dateTime.getTime() - a.dateTime.getTime(),
        );
      } else if (user.role === Role.STAFF) {
        return mappedBookings
          .filter((b: any) => b.staffId === user.id)
          .sort(
            (a: any, b: any) => b.dateTime.getTime() - a.dateTime.getTime(),
          );
      } else {
        return mappedBookings
          .filter((b: any) => b.clientId === user.id)
          .sort(
            (a: any, b: any) => b.dateTime.getTime() - a.dateTime.getTime(),
          );
      }
    } catch {
      if (user.role === Role.ADMIN) {
        return this.prisma.booking.findMany({
          include: { client: true, service: true, staff: true },
          orderBy: { dateTime: "desc" },
        });
      } else if (user.role === Role.STAFF) {
        return this.prisma.booking.findMany({
          where: { staffId: user.id },
          include: { client: true, service: true, staff: true },
          orderBy: { dateTime: "desc" },
        });
      } else {
        // CLIENT
        return this.prisma.booking.findMany({
          where: { clientId: user.id },
          include: { client: true, service: true, staff: true },
          orderBy: { dateTime: "desc" },
        });
      }
    }
  }

  async getOne(id: string, user: User) {
    let booking: any = null;
    try {
      const scrymeBooking = await this.scrymeService.getBooking(id);
      booking = await this.mapScrymeBooking(scrymeBooking);
    } catch {
      booking = await this.prisma.booking.findUnique({
        where: { id },
        include: { client: true, service: true, staff: true },
      });
    }

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    // Authorization checks
    if (user.role === Role.CLIENT && booking.clientId !== user.id) {
      throw new ForbiddenException("You cannot access this booking");
    }
    if (user.role === Role.STAFF && booking.staffId !== user.id) {
      throw new ForbiddenException("You cannot access this booking");
    }

    return booking;
  }

  async create(
    user: User,
    dto: {
      clientId?: string;
      serviceId: string;
      staffId: string;
      dateTime: string;
    },
  ) {
    // 1. Resolve client (if admin/staff, they can pass clientId, otherwise use current user's ID)
    const targetClientId =
      (user.role === Role.ADMIN || user.role === Role.STAFF) && dto.clientId
        ? dto.clientId
        : user.id;

    // 2. Validate client exists
    const client = await this.prisma.user.findUnique({
      where: { id: targetClientId },
    });
    if (!client) {
      throw new NotFoundException(
        `Client user with ID ${targetClientId} not found`,
      );
    }

    // 3. Validate service exists via ServicesService (which checks Scryme)
    let service: any;
    try {
      service = await this.servicesService.getOne(dto.serviceId);
    } catch {
      throw new NotFoundException(`Service with ID ${dto.serviceId} not found`);
    }

    // 4. Validate staff exists and has either ADMIN or STAFF role
    const staff = await this.prisma.user.findUnique({
      where: { id: dto.staffId },
    });
    if (!staff) {
      throw new NotFoundException(
        `Staff user with ID ${dto.staffId} not found`,
      );
    }
    if (staff.role !== Role.STAFF && staff.role !== Role.ADMIN) {
      throw new BadRequestException(
        `User ${staff.name} is not a valid staff member / therapist`,
      );
    }

    // 5. Check if booking date is in the future
    const bookingDateTime = new Date(dto.dateTime);
    if (isNaN(bookingDateTime.getTime())) {
      throw new BadRequestException("Invalid date/time format");
    }
    if (bookingDateTime < new Date()) {
      throw new BadRequestException("Booking date/time must be in the future");
    }

    const payload = {
      serviceId: dto.serviceId,
      customerId: targetClientId,
      scheduledStartTime: bookingDateTime.toISOString(),
      staffIds: [dto.staffId],
    };

    // 6. Delegate heavy-lifting booking creation to Scryme
    try {
      const scrymeBooking = (await this.scrymeService.createBooking(
        payload,
      )) as any;
      return {
        id: scrymeBooking.id || "scryme-booking-id",
        clientId: targetClientId,
        serviceId: dto.serviceId,
        staffId: dto.staffId,
        dateTime: bookingDateTime,
        status: BookingStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date(),
        client,
        service,
        staff,
      };
    } catch {
      // 7. Fallback to local persistence
      const localBooking = await this.prisma.booking.create({
        data: {
          clientId: targetClientId,
          serviceId: dto.serviceId,
          staffId: dto.staffId,
          dateTime: bookingDateTime,
          status: BookingStatus.PENDING,
        },
        include: { client: true, service: true, staff: true },
      });

      this.failedBookingsQueue.push({
        id: localBooking.id,
        payload,
      });

      return localBooking;
    }
  }

  async updateStatus(id: string, user: User, status: BookingStatus) {
    const booking = await this.getOne(id, user);

    // Clients can only cancel their booking
    if (user.role === Role.CLIENT) {
      if (status !== BookingStatus.CANCELLED) {
        throw new ForbiddenException("Clients can only cancel their booking");
      }
      if (
        booking.status === BookingStatus.COMPLETED ||
        booking.status === BookingStatus.CANCELLED
      ) {
        throw new BadRequestException(
          `Cannot cancel a booking that is already ${booking.status}`,
        );
      }
    }

    // Delegate status update to Scryme if matching status change
    try {
      let scrymeStatus = "PENDING";
      if (status === BookingStatus.CANCELLED) scrymeStatus = "CANCELLED";
      else if (status === BookingStatus.CONFIRMED) scrymeStatus = "CONFIRMED";
      else if (status === BookingStatus.COMPLETED) scrymeStatus = "COMPLETED";

      await this.scrymeService.updateBookingStatus(id, {
        status: scrymeStatus as any,
      });
    } catch {
      // Graceful fallback / logging since Scryme might not have this specific booking ID stored locally
    }

    const localBookingExists = await this.prisma.booking.findUnique({
      where: { id },
    });
    if (localBookingExists) {
      return this.prisma.booking.update({
        where: { id },
        data: { status },
        include: { client: true, service: true, staff: true },
      });
    } else {
      return {
        ...booking,
        status,
      };
    }
  }
}
