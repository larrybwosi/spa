import { Module, Global } from "@nestjs/common";
import { ScrymeService } from "./scryme.service";
import { ScrymeController } from "./scryme.controller";

@Global()
@Module({
  controllers: [ScrymeController],
  providers: [ScrymeService],
  exports: [ScrymeService],
})
export class ScrymeModule {}
