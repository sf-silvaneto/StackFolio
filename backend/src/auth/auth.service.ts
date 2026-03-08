import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; 
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  // CONFIGURAÇÃO DO EMAIL (Nodemailer)
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'stackfolio.contato@gmail.com', 
      pass: 'szjyweuesnrpfybh' // Senha de App
    },
  });

  constructor(private prisma: PrismaService) {}

  // --- LÓGICA DE E-MAIL ---
  async sendEmailCode(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // Nota: Reutilizamos a tabela smsVerification para guardar o código do e-mail
    await this.prisma.smsVerification.upsert({
      where: { phone: email }, 
      update: { code, expiresAt },
      create: { phone: email, code, expiresAt },
    });

    try {
      await this.transporter.sendMail({
        from: '"StackFolio" <stackfolio.contato@gmail.com>',
        to: email,                                           
        subject: 'Seu código de verificação - StackFolio',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 40px 20px; text-align: center; background-color: #f8fafc; border-radius: 10px;">
            <h2 style="color: #0f172a; margin-bottom: 20px;">Bem-vindo ao StackFolio!</h2>
            <p style="color: #475569; font-size: 16px;">Aqui está o seu código de verificação de conta:</p>
            <div style="background-color: #ffffff; border: 2px dashed #10b981; border-radius: 12px; padding: 20px; display: inline-block; margin: 20px 0;">
              <h1 style="color: #10b981; font-size: 48px; letter-spacing: 10px; margin: 0;">${code}</h1>
            </div>
            <p style="color: #64748b; font-size: 14px;">Este código expira em 15 minutos.</p>
          </div>
        `,
      });
      
      console.log(`[E-MAIL REAL] Enviando código ${code} para o e-mail ${email}`);
      return { success: true, message: 'Código enviado com sucesso.' };
      
    } catch (error) {
      console.error('[ERRO DE E-MAIL] Falha ao enviar:', error);
      throw new BadRequestException('Não foi possível enviar o e-mail. Verifique o endereço.');
    }
  }

  async verifyEmailCode(email: string, code: string) {
    const verification = await this.prisma.smsVerification.findUnique({ where: { phone: email } });
    if (!verification || verification.code !== code || new Date() > verification.expiresAt) {
      return { valid: false };
    }
    return { valid: true };
  }

  // --- LÓGICA DE AUTENTICAÇÃO E REGISTO COMPLETO ---
  async register(data: RegisterDto) {
    const email = String(data.email).trim().toLowerCase();
    const username = String(data.username).trim().toLowerCase();

    const existingEmail = await this.prisma.user.findUnique({ where: { email } });
    if (existingEmail) throw new ConflictException('Este e-mail já está em uso.');

    const existingUsername = await this.prisma.user.findUnique({ where: { username } });
    if (existingUsername) throw new ConflictException('Este link de usuário já está em uso.');

    const hashedPassword = await bcrypt.hash(String(data.password), 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password_hash: hashedPassword,
        fullName: data.fullName,
        displayName: data.displayName,
        phone: data.phone || null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        role: data.role || null,
        seniority: data.seniority || null,
        englishLevel: data.englishLevel || null,
        availability: data.availability || null,
        location: data.location || null,
        bio: data.bio || null,
        tools: data.tools || null, 
      },
    });

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); 

    await this.prisma.session.create({
      data: { userId: user.id, sessionToken, expiresAt },
    });

    return { 
      message: 'Perfil criado e lançado com sucesso!', 
      sessionToken,
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username, 
        displayName: user.displayName,
        role: user.role
      }
    };
  }

  async login(data: LoginDto) {
    const email = String(data.email).trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.password_hash) throw new UnauthorizedException('E-mail ou senha inválidos.');

    const isPasswordValid = await bcrypt.compare(String(data.password), user.password_hash);
    if (!isPasswordValid) throw new UnauthorizedException('E-mail ou senha inválidos.');

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); 

    await this.prisma.session.create({
      data: { userId: user.id, sessionToken, expiresAt },
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
        profileImg: user.profileImg,
        role: user.role 
      }
    };
  }

  async checkEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    return { available: !user };
  }

  async checkUsername(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username: username.toLowerCase() } });
    return { available: !user };
  }
}