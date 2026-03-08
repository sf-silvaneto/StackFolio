import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express'; // Importamos os validadores do Express

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Permite comunicação com o frontend e os cookies da sessão
  app.enableCors({
    origin: 'http://localhost:5173', // Confirme se o seu frontend roda nesta porta (Vite padrão)
    credentials: true,
  });

  // 2. AUMENTA O LIMITE PARA 50MB (Essencial para receber as imagens Base64 do Perfil)
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.listen(3000);
}
bootstrap();