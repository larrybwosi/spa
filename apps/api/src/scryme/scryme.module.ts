import { Module, Global } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { ScrymeService } from "./scryme.service";
import { ScrymeController } from "./scryme.controller";
import { ScrymeCacheService } from "./scryme-cache.service";
import { ScrymeBaseService } from "./scryme-base.service";
import { ScrymeCustomersService } from "./scryme-customers.service";
import { ScrymeMembersService } from "./scryme-members.service";
import { ScrymeShiftsService } from "./scryme-shifts.service";
import { ScrymeBookingsService } from "./scryme-bookings.service";
import { ScrymeCatalogService } from "./scryme-catalog.service";
import { ScrymeOrdersService } from "./scryme-orders.service";

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [ScrymeController],
  providers: [
    ScrymeBaseService,
    ScrymeCustomersService,
    ScrymeMembersService,
    ScrymeShiftsService,
    ScrymeBookingsService,
    ScrymeCatalogService,
    ScrymeOrdersService,
    ScrymeService,
    ScrymeCacheService,
  ],
  exports: [
    ScrymeBaseService,
    ScrymeCustomersService,
    ScrymeMembersService,
    ScrymeShiftsService,
    ScrymeBookingsService,
    ScrymeCatalogService,
    ScrymeOrdersService,
    ScrymeService,
    ScrymeCacheService,
  ],
})
export class ScrymeModule {}
