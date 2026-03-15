import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Alterado para NestExpressApplication para habilitar useStaticAssets
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. Parser de Cookies
  app.use(cookieParser());

  // 2. Validação Global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // 3. CORS: Configurado para aceitar cookies do Frontend
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // 4. Servir pasta de uploads de forma estática (Fotos de Perfil)
  // Certifica-te de que a pasta 'uploads' existe na raiz do backend
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // 5. Limites de Payload para suportar strings Base64 pesadas (Imagens)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.listen(3000);
  console.log(`\x1b[32m[StackFolio]\x1b[0m Backend iniciado em: http://localhost:3000`);
}
bootstrap();