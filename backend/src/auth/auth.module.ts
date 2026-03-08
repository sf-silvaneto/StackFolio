import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma.service'; // Importe o PrismaService aqui!

@Module({
  controllers: [AuthController],
  providers: [
    AuthService, 
    PrismaService // <-- Adicione o PrismaService aqui!
  ],
})
export class AuthModule {}