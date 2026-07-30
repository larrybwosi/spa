import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { OrdersModule } from './orders/orders.module';
import { ScrymeModule } from './scryme/scryme.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProductsModule,
    ServicesModule,
    BookingsModule,
    OrdersModule,
    ScrymeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
