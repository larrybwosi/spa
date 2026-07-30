import { Module } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { ServicesController } from "./services.controller";
import { ScrymeModule } from "../scryme/scryme.module";
import { PrismaModule } from "../prisma.module";

@Module({
  imports: [ScrymeModule, PrismaModule],
  providers: [ServicesService],
  controllers: [ServicesController],
  exports: [ServicesService],
})
export class ServicesModule {}
