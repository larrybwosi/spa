import { Module, Global } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { ScrymeService } from "./scryme.service";
import { ScrymeController } from "./scryme.controller";
import { ScrymeCacheService } from "./scryme-cache.service";

@Global()
@Module({
  imports: [CacheModule.register()],
  controllers: [ScrymeController],
  providers: [ScrymeService, ScrymeCacheService],
  exports: [ScrymeService, ScrymeCacheService],
})
export class ScrymeModule {}
