import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerCustom } from './logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerCustom()
  });

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: ["GET", "POST"],
    credentials: true,
  });

  await app.listen(3001);
}
bootstrap();
