import { Injectable, NotFoundException, BadRequestException, ForbiddenException, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ScrymeService } from '../scryme/scryme.service';
import { User, Role } from '@prisma/client';

@Injectable()
export class OrdersService implements OnModuleInit, OnModuleDestroy {
  private failedOrdersQueue: { id: string; payload: any }[] = [];
  private queueInterval: any;

  constructor(
    private prisma: PrismaService,
    private scrymeService: ScrymeService,
  ) {}

  onModuleInit() {
    this.queueInterval = setInterval(() => this.processQueue(), 30000);
    if (this.queueInterval && typeof this.queueInterval.unref === 'function') {
      this.queueInterval.unref();
    }
  }

  onModuleDestroy() {
    if (this.queueInterval) {
      clearInterval(this.queueInterval);
    }
  }

  private async processQueue() {
    if (this.failedOrdersQueue.length === 0) return;
    const nextQueue = [];
    for (const item of this.failedOrdersQueue) {
      try {
        await this.scrymeService.createOrder(item.payload);
      } catch (err) {
        nextQueue.push(item);
      }
    }
    this.failedOrdersQueue = nextQueue;
  }

  private async mapScrymeOrder(order: any) {
    const clientId = order.customerId || '';

    const client = clientId
      ? await this.prisma.user.findUnique({ where: { id: clientId } }).catch(() => null)
      : null;

    const mappedItems = [];
    if (order.items && Array.isArray(order.items)) {
      for (const item of order.items) {
        const productId = item.variantId;
        const product = await this.prisma.product.findUnique({ where: { id: productId } }).catch(() => null);
        mappedItems.push({
          id: item.id || `item-${productId}-${order.id}`,
          orderId: order.id,
          productId,
          quantity: item.quantity,
          price: item.unitPrice || 0,
          createdAt: new Date(order.createdAt || Date.now()),
          updatedAt: new Date(order.createdAt || Date.now()),
          product: product || { id: productId, name: 'Unknown Product', price: item.unitPrice || 0, stock: 0 },
        });
      }
    }

    return {
      id: order.id,
      clientId,
      totalPrice: order.totalAmount || 0,
      createdAt: new Date(order.createdAt || Date.now()),
      updatedAt: new Date(order.createdAt || Date.now()),
      client: client || { id: clientId, name: 'Guest Client', email: '' },
      items: mappedItems,
    };
  }

  async getAll(user: User) {
    try {
      const scrymeOrders = await this.scrymeService.listOrders();
      const mappedOrders = await Promise.all(
        scrymeOrders.map((o) => this.mapScrymeOrder(o)),
      );

      if (user.role === Role.ADMIN || user.role === Role.STAFF) {
        return mappedOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      } else {
        return mappedOrders
          .filter((o) => o.clientId === user.id)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
    } catch (error) {
      if (user.role === Role.ADMIN || user.role === Role.STAFF) {
        return this.prisma.order.findMany({
          include: {
            client: true,
            items: {
              include: { product: true },
            },
          },
          orderBy: { createdAt: 'desc' },
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
          orderBy: { createdAt: 'desc' },
        });
      }
    }
  }

  async getOne(id: string, user: User) {
    let order: any = null;
    try {
      const scrymeOrders = await this.scrymeService.listOrders();
      const found = scrymeOrders.find((o) => o.id === id);
      if (found) {
        order = await this.mapScrymeOrder(found);
      }
    } catch (error) {
      // Ignored, fallback below
    }

    if (!order) {
      order = await this.prisma.order.findUnique({
        where: { id },
        include: {
          client: true,
          items: {
            include: { product: true },
          },
        },
      });
    }

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (user.role === Role.CLIENT && order.clientId !== user.id) {
      throw new ForbiddenException('You cannot access this order');
    }

    return order;
  }

  async create(user: User, dto: { clientId?: string; items: { productId: string; quantity: number }[] }) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Determine target client
    const targetClientId = (user.role === Role.ADMIN || user.role === Role.STAFF) && dto.clientId
      ? dto.clientId
      : user.id;

    // Verify client exists
    const client = await this.prisma.user.findUnique({ where: { id: targetClientId } });
    if (!client) {
      throw new NotFoundException(`Client user with ID ${targetClientId} not found`);
    }

    // Validate and fetch items locally
    let totalPrice = 0;
    const scrymeItems = [];
    const productsToMap = [];

    for (const item of dto.items) {
      if (item.quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than 0');
      }

      const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
        );
      }

      totalPrice += product.price * item.quantity;
      scrymeItems.push({
        variantId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
      });
      productsToMap.push(product);
    }

    const payload = {
      customerId: targetClientId,
      locationId: process.env.SCRYME_LOCATION_ID || 'default-location',
      items: scrymeItems,
      channel: 'ECOMMERCE_STORE',
    };

    // Try delegation to Scryme first
    try {
      const scrymeOrder = await this.scrymeService.createOrder(payload);

      const orderItems = dto.items.map((item, idx) => {
        const product = productsToMap[idx];
        return {
          id: `item-${product.id}`,
          orderId: scrymeOrder.id || 'scryme-order-id',
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
          createdAt: new Date(),
          updatedAt: new Date(),
          product,
        };
      });

      return {
        id: scrymeOrder.id || 'scryme-order-id',
        clientId: targetClientId,
        totalPrice,
        createdAt: new Date(),
        updatedAt: new Date(),
        client,
        items: orderItems,
      };
    } catch (error) {
      // Fallback to local DB and queue
      return this.prisma.$transaction(async (tx) => {
        const orderItemsToCreate = [];

        for (const item of dto.items) {
          const product = await tx.product.findUnique({ where: { id: item.productId } });
          await tx.product.update({
            where: { id: product.id },
            data: {
              stock: product.stock - item.quantity,
            },
          });

          orderItemsToCreate.push({
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
          });
        }

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

        this.failedOrdersQueue.push({
          id: order.id,
          payload,
        });

        return order;
      });
    }
  }
}
