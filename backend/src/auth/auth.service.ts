import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; 
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(data: RegisterDto) {
    const email = String(data.email).trim();
    const username = String(data.username).trim();
    const password = String(data.password);

    // 1. Verificação de duplicidade de Email
    const existingEmail = await this.prisma.user.findUnique({ 
      where: { email } 
    });
    if (existingEmail) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    // 2. Verificação de duplicidade de Username (Evita o erro P2002)
    const existingUsername = await this.prisma.user.findUnique({ 
      where: { username } 
    });
    if (existingUsername) {
      throw new ConflictException('Este nome de utilizador já está em uso.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Criar o utilizador
    const user = await this.prisma.user.create({
      data: {
        email: email,
        username: username,
        password_hash: hashedPassword,
        displayName: username,
      },
    });

    // 4. MÁGICA: Gera sessão imediata após registro para evitar erro 401 no frontend
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); 

    await this.prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: sessionToken,
        expiresAt: expiresAt,
      },
    });

    return { 
      message: 'Utilizador criado com sucesso!', 
      sessionToken, // Enviamos o token já no registro
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
      }
    };
  }

  async login(data: LoginDto) {
    const email = String(data.email).trim();
    const password = String(data.password);

    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user || !user.password_hash) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); 

    await this.prisma.session.create({
      data: {
        userId: user.id,
        sessionToken: sessionToken,
        expiresAt: expiresAt,
      },
    });

    return {
      message: 'Login efetuado com sucesso.',
      sessionToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        displayName: user.displayName || user.username,
        profileImg: user.profileImg
      }
    };
  }
}