import { Module, Global } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { BetterAuthGuard } from "./better-auth.guard";
import { RolesGuard } from "./roles.guard";

@Global()
@Module({
  providers: [AuthService, BetterAuthGuard, RolesGuard],
  controllers: [AuthController],
  exports: [AuthService, BetterAuthGuard, RolesGuard],
})
export class AuthModule {}
