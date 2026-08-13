import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "@/prisma.module";
import { AuthModule } from "@/modules/auth/auth.module";
import { ProductsModule } from "@/modules/products/products.module";
import { ServicesModule } from "@/modules/services/services.module";
import { BookingsModule } from "@/modules/bookings/bookings.module";
import { OrdersModule } from "@/modules/orders/orders.module";
import { ScrymeModule } from "@/integrations/scryme/scryme.module";

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
