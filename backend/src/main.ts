import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Cria a aplicação NestJS baseada no seu módulo principal
  const app = await NestFactory.create(AppModule);

  // 1. Configuração de CORS (Cross-Origin Resource Sharing)
  // Essencial para que o seu Frontend (Vite na porta 5173) consiga falar com este Backend (porta 3000)
  app.enableCors({
    origin: 'http://localhost:5173', // Permite apenas a origem do seu site em desenvolvimento
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Libera todos os métodos necessários
    credentials: true, // Permite o envio de cookies/tokens se necessário
  });

  // 2. Global Pipes (Validação)
  // Garante que os dados enviados (como o token do Google) sejam validados antes de processar
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove campos que não estão no DTO
    forbidNonWhitelisted: true, // Retorna erro se enviarem campos desconhecidos
    transform: true, // Converte tipos automaticamente
  }));

  // 3. Inicialização do Servidor
  // O servidor escuta na porta 3000, padrão que configuramos no seu Docker e Frontend
  await app.listen(3000);
  
  console.log(`🚀 StackFolio Backend rodando em: http://localhost:3000`);
}

// Inicia o processo
bootstrap();