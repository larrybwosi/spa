import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { ScrymeModule } from "@/integrations/scryme/scryme.module";
import { PrismaModule } from "@/prisma.module";

@Module({
  imports: [ScrymeModule, PrismaModule],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
