import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { BookingStatus, User, Role } from "@prisma/client";

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async getAll(user: User) {
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

  async getOne(id: string, user: User) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { client: true, service: true, staff: true },
    });

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

    // 3. Validate service exists
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });
    if (!service) {
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

    return this.prisma.booking.create({
      data: {
        clientId: targetClientId,
        serviceId: dto.serviceId,
        staffId: dto.staffId,
        dateTime: bookingDateTime,
        status: BookingStatus.PENDING,
      },
      include: { client: true, service: true, staff: true },
    });
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

    return this.prisma.booking.update({
      where: { id },
      data: { status },
      include: { client: true, service: true, staff: true },
    });
  }
}
