import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: pg.Pool;

  constructor() {
    // Read DATABASE_URL from process.env
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not defined.');
    }
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
    await this.seedIfNeeded();
  }

  private async seedIfNeeded() {
    const serviceCount = await this.service.count();
    if (serviceCount === 0) {
      console.log('No services found in database. Seeding initial services...');
      await this.service.createMany({
        data: [
          {
            id: 's1',
            name: 'Swedish Massage',
            description: 'A gentle full-body massage ideal for people who are new to massage, have a lot of tension, or are sensitive to touch.',
            duration: 60,
            price: 95.0,
          },
          {
            id: 's2',
            name: 'Deep Tissue Massage',
            description: 'Uses more pressure to reach deeper muscle layers. Best for chronic aches, pain, or rehabilitation.',
            duration: 75,
            price: 120.0,
          },
          {
            id: 's3',
            name: 'Hot Stone Therapy',
            description: 'Heated flat stones are placed on specific parts of your body to deepen relaxation and ease tense muscles.',
            duration: 90,
            price: 150.0,
          },
          {
            id: 's4',
            name: 'Radiant Glow Facial',
            description: 'A classic deep cleansing facial combined with gentle exfoliation and a customized moisturizing mask.',
            duration: 45,
            price: 85.0,
          },
          {
            id: 's5',
            name: 'Anti-Aging Collagen Facial',
            description: 'Infused with collagen and advanced serums to target fine lines and improve skin elasticity.',
            duration: 60,
            price: 110.0,
          },
          {
            id: 's6',
            name: 'Eucalyptus Steam & Sauna',
            description: 'Relax in our state-of-the-art steam room infused with premium pure eucalyptus oils.',
            duration: 30,
            price: 40.0,
          },
          {
            id: 's7',
            name: 'Himalayan Salt Sauna',
            description: 'Relax in dry heat surrounded by ancient pink salt crystals that emit negative ions.',
            duration: 30,
            price: 45.0,
          },
        ],
      });
    }

    const productCount = await this.product.count();
    if (productCount === 0) {
      console.log('No products found in database. Seeding initial products...');
      await this.product.createMany({
        data: [
          {
            id: 'p1',
            name: 'Bloom rose oil',
            description: 'Bespoke rose oil for ultimate skin glow and hydration.',
            price: 49.0,
            stock: 100,
          },
          {
            id: 'p2',
            name: 'Argan oil',
            description: 'Premium organic argan oil for hair and body wellness.',
            price: 69.0,
            stock: 100,
          },
          {
            id: 'p3',
            name: 'Swedish massage oil',
            description: 'Authentic organic Swedish massage oil with a lavender scent.',
            price: 59.0,
            stock: 100,
          },
          {
            id: 'p4',
            name: 'Hot stone set',
            description: 'Bespoke high-quality volcanic basalt hot stones for home therapy.',
            price: 89.0,
            stock: 50,
          },
          {
            id: 'p5',
            name: 'Citrus body scrub',
            description: 'Invigorating organic citrus body scrub for radiant skin.',
            price: 39.0,
            stock: 100,
          },
        ],
      });
    }

    const staffCount = await this.user.count({ where: { role: 'STAFF' } });
    if (staffCount === 0) {
      console.log('No staff users found. Seeding initial staff...');
      const hashedPassword = await bcrypt.hash('password123', 10);

      const staff1 = await this.user.create({
        data: {
          id: 'staff1',
          name: 'Elena Rostova',
          email: 'elena@aurawellness.com',
          role: 'STAFF',
          accounts: {
            create: {
              accountId: 'elena@aurawellness.com',
              providerId: 'credential',
              password: hashedPassword,
            },
          },
        },
      });

      const staff2 = await this.user.create({
        data: {
          id: 'staff2',
          name: 'Marcus Vance',
          email: 'marcus@aurawellness.com',
          role: 'STAFF',
          accounts: {
            create: {
              accountId: 'marcus@aurawellness.com',
              providerId: 'credential',
              password: hashedPassword,
            },
          },
        },
      });
      console.log('Staff users seeded:', staff1.name, ',', staff2.name);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    if (this.pool) {
      await this.pool.end();
    }
  }
}
