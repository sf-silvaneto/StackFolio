import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Ativa os validadores globais (importante para os DTOs funcionarem)
  app.useGlobalPipes(new ValidationPipe());

  // 1. CORS: Permite que o Front na porta 5173 fale com o Back
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // 2. Limites de Payload (Base64 imagens)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.listen(3000);
}
bootstrap();