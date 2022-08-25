import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './core/interceptors/transform.interceptor';

console.log(process.env);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  const PORT = 3000;
  await app.listen(PORT);
  const logger = new Logger();
  logger.log(`Application listening on port ${PORT}`);
}
bootstrap();
