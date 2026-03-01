import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service'; // 1. Importa o Prisma

@Module({
  imports: [
    // Configuração do gerador de Tokens JWT
    JwtModule.register({
      global: true,
      secret: 'stackfolio-super-secret-key', // Em produção, idealmente fica no .env
      signOptions: { expiresIn: '1d' }, // Token vale por 1 dia
    }),
  ],
  controllers: [AuthController],
  
  // 2. O segredo está aqui! Avisamos que o AuthService e o PrismaService trabalham juntos neste módulo.
  providers: [AuthService, PrismaService], 
})
export class AuthModule {}