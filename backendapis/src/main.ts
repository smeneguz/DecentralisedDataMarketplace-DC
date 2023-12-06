import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerCustom } from './logger/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerCustom()
  });

  const config = new DocumentBuilder()
    .setTitle('Data-Cellar Marketplace')
    .setDescription('The DLT-based Marketplace endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
