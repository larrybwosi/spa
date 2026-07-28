import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so our mobile application (Android) and client website can connect seamlessly
  app.enableCors({
    origin: true, // or configure specific domains in production
    credentials: true,
  });

  // Enable cookie parsing so we can read session cookies seamlessly
  app.use(cookieParser());

  // Set standard API global prefix
  app.setGlobalPrefix("api");

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(
    `NestJS Spa and Wellness API is running on: http://localhost:${port}/api`,
  );
}
bootstrap();
