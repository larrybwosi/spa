import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { User, Role } from "@prisma/client";

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getAll(user: User) {
    if (user.role === Role.ADMIN || user.role === Role.STAFF) {
      return this.prisma.order.findMany({
        include: {
          client: true,
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // CLIENT
      return this.prisma.order.findMany({
        where: { clientId: user.id },
        include: {
          client: true,
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }
  }

  async getOne(id: string, user: User) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        client: true,
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (user.role === Role.CLIENT && order.clientId !== user.id) {
      throw new ForbiddenException("You cannot access this order");
    }

    return order;
  }

  async create(
    user: User,
    dto: {
      clientId?: string;
      items: { productId: string; quantity: number }[];
    },
  ) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException("Order must contain at least one item");
    }

    // Determine target client
    const targetClientId =
      (user.role === Role.ADMIN || user.role === Role.STAFF) && dto.clientId
        ? dto.clientId
        : user.id;

    // Verify client exists
    const client = await this.prisma.user.findUnique({
      where: { id: targetClientId },
    });
    if (!client) {
      throw new NotFoundException(
        `Client user with ID ${targetClientId} not found`,
      );
    }

    // Run order placement inside a database transaction to ensure safety and atomic updates
    return this.prisma.$transaction(async (tx) => {
      let totalPrice = 0;
      const orderItemsToCreate = [];

      for (const item of dto.items) {
        if (item.quantity <= 0) {
          throw new BadRequestException("Quantity must be greater than 0");
        }

        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) {
          throw new NotFoundException(
            `Product with ID ${item.productId} not found`,
          );
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
          );
        }

        // Decrement stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity,
          },
        });

        const itemTotalPrice = product.price * item.quantity;
        totalPrice += itemTotalPrice;

        orderItemsToCreate.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Create the main Order
      const order = await tx.order.create({
        data: {
          clientId: targetClientId,
          totalPrice,
          items: {
            createMany: {
              data: orderItemsToCreate,
            },
          },
        },
        include: {
          client: true,
          items: {
            include: { product: true },
          },
        },
      });

      return order;
    });
  }
}
