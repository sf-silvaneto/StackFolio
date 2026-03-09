import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; 
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as nodemailer from 'nodemailer';

const RESERVED_WORDS = [
  'admin', 'login', 'logar', 'entrar', 'signin', 'sign-in', 'register', 'registrar', 
  'registro', 'cadastro', 'cadastrar', 'signup', 'sign-up', 'logout', 'sair', 'auth', 
  'password', 'senha', 'recover', 'recuperar', 'reset', 'forgot', 'esqueci', 'verify', 
  'verificar', 'oauth', 'oauth2', 'sso', 'mfa', '2fa', 'magiclink',
  'perfil', 'profile', 'home', 'index', 'dashboard', 'painel', 'settings', 'config', 
  'configuracoes', 'explore', 'explorar', 'feed', 'timeline', 'search', 'busca', 
  'buscar', 'pesquisa', 'jobs', 'vaga', 'vagas', 'careers', 'carreiras', 'empresas', 
  'companies', 'company', 'projetos', 'projects', 'project', 'portfolio', 'curriculo', 
  'cv', 'resume', 'network', 'conexoes', 'connections', 'friends', 'amigos', 
  'followers', 'seguidores', 'following', 'seguindo', 'inbox', 'messages', 'message', 
  'mensagens', 'mensagem', 'chat', 'dm', 'pm', 'talk', 'conversas', 'notifications', 
  'notificacoes', 'forum', 'community', 'comunidade', 'events', 'eventos', 'courses', 
  'cursos', 'learn', 'aprender', 'certifications', 'certificados', 'talents', 'talentos', 
  'recruiters', 'recrutadores', 'hire', 'contratar', 'freelance', 'freelancer', 
  'analytics', 'stats', 'estatisticas', 'post', 'posts', 'article', 'artigo', 
  'news', 'noticias', 'blog', 'update', 'updates', 'changelog', 'releases',
  'likes', 'favoritos', 'favorites', 'saved', 'salvos', 'bookmarks', 'groups', 
  'grupos', 'pages', 'paginas', 'trending', 'popular', 'latest', 'recentes',
  'suporte', 'help', 'ajuda', 'faq', 'contact', 'contato', 'about', 'sobre', 
  'stackfolio', 'termos', 'terms', 'privacy', 'privacidade', 'legal', 'tos', 
  'copyright', 'dmca', 'report', 'reportar', 'denunciar', 'abuse', 'abuso', 
  'status', 'pricing', 'planos', 'billing', 'assinatura', 'pagamento', 'premium', 
  'pro', 'vip', 'sponsor', 'patrocinador', 'partner', 'parceiros', 'press', 
  'imprensa', 'media', 'midia', 'official', 'oficial', 'verified', 'verificado', 
  'trust', 'security', 'seguranca', 'marketing', 'ads', 'afiliados', 'affiliates', 
  'promo', 'promocao', 'sales', 'vendas', 'hr', 'rh', 'it', 'ti',
  'api', 'graphql', 'rest', 'webhook', 'webhooks', 'root', 'system', 'sysadmin', 
  'administrator', 'moderator', 'mod', 'staff', 'test', 'teste', 'demo', 'sandbox', 
  'guest', 'convidado', 'anonymous', 'anonimo', 'null', 'undefined', 'void', 'user', 
  'users', 'app', 'web', 'mail', 'email', 'host', 'server', 'bot', 'robot', 'assets', 
  'static', 'public', 'images', 'img', 'css', 'js', 'fonts', 'favicon', 'robots', 
  'sitemap', 'rss', 'json', 'xml', 'yaml', 'yml', 'md', 'mdx', 'socket', 'ws', 
  'cdn', 'swagger', 'openapi', '.well-known', 'manifest', 'pwa',
  'foda', 'fodase', 'foda-se', 'caralho', 'puta', 'puto', 'merda', 'bosta', 'cu',
  'buceta', 'pica', 'cacete', 'porra', 'corno', 'arrombado', 'viado', 'viadinho', 
  'babaca', 'fdp', 'pqp', 'vtnc', 'vsf', 'kct', 'vagabundo', 'vagabunda', 'safado', 
  'safada', 'pinto', 'rola', 'xoxota', 'macaco', 'boquete', 'punheta', 'siririca', 
  'cuzao', 'cuzinho', 'sapatao', 'vadia', 'rapariga', 'maconheiro', 'incel',
  'fuck', 'shit', 'bitch', 'cunt', 'dick', 'ass', 'asshole', 'slut', 'whore', 'fag', 
  'faggot', 'dyke', 'tranny', 'retard', 'nigga', 'nigger', 'kys', 'kill',
  'retardado', 'trouxa', 'otario', 'lixo', 'nazi', 'nazista', 'nazism', 'hitler',
  'racista', 'fascista', 'terrorista', 'terrorist', 'pedofilo', 'pedofilia', 
  'estupro', 'estuprador', 'rape', 'suicidio', 'suicide', 'murder', 'assassinato',
  'gore', 'porn', 'porno', 'nsfw', 'xxx', 'sex', 'sexo', 'nude', 'nudes', 'onlyfans'
];

@Injectable()
export class AuthService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'stackfolio.contato@gmail.com', 
      pass: 'szjyweuesnrpfybh' 
    },
  });

  constructor(private prisma: PrismaService) {}

  async sendEmailCode(email: string) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

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

  async forgotPassword(email: string) {
    const userEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: userEmail } });
    
    if (!user) {
      return { message: 'Se este e-mail estiver cadastrado, enviamos um código de recuperação.' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    await this.prisma.smsVerification.upsert({
      where: { phone: userEmail }, 
      update: { code, expiresAt },
      create: { phone: userEmail, code, expiresAt },
    });

    try {
      await this.transporter.sendMail({
        from: '"StackFolio" <stackfolio.contato@gmail.com>',
        to: userEmail,                                           
        subject: 'Recuperação de Senha - StackFolio',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 40px 20px; text-align: center; background-color: #f8fafc; border-radius: 10px;">
            <h2 style="color: #0f172a; margin-bottom: 20px;">Recuperação de Senha</h2>
            <p style="color: #475569; font-size: 16px;">Recebemos um pedido para alterar a sua senha. Use o código abaixo:</p>
            <div style="background-color: #ffffff; border: 2px dashed #3b82f6; border-radius: 12px; padding: 20px; display: inline-block; margin: 20px 0;">
              <h1 style="color: #3b82f6; font-size: 48px; letter-spacing: 10px; margin: 0;">${code}</h1>
            </div>
            <p style="color: #64748b; font-size: 14px;">Este código expira em 15 minutos. Se não foi você quem pediu, pode ignorar este e-mail com segurança.</p>
          </div>
        `,
      });
      return { message: 'Se este e-mail estiver cadastrado, enviamos um código de recuperação.' };
    } catch (error) {
      console.error('[ERRO DE E-MAIL] Falha ao enviar:', error);
      throw new BadRequestException('Erro ao tentar enviar o e-mail de recuperação.');
    }
  }

  async resetPassword(data: any) {
    const userEmail = data.email.trim().toLowerCase();
    
    const verification = await this.prisma.smsVerification.findUnique({ where: { phone: userEmail } });
    if (!verification || verification.code !== data.code || new Date() > verification.expiresAt) {
      throw new BadRequestException('Código inválido ou expirado.');
    }

    const hashedPassword = await bcrypt.hash(String(data.newPassword), 10);
    await this.prisma.user.update({
      where: { email: userEmail },
      data: { password_hash: hashedPassword },
    });

    await this.prisma.smsVerification.delete({ where: { phone: userEmail } });

    return { message: 'Senha atualizada com sucesso!' };
  }

  async register(data: RegisterDto) {
    const email = String(data.email).trim().toLowerCase();
    const username = String(data.username).trim().toLowerCase();

    if (RESERVED_WORDS.includes(username)) {
      throw new ConflictException('Este link de usuário é reservado pelo sistema.');
    }

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
        email_verified: true,                 // <-- Forçando conta 100% verificada na criação!
        fullName: data.fullName,
        displayName: data.displayName,
        phone: data.phone || null,
        gender: data.gender || null,          // <-- Salvando o Gênero aqui!
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        role: data.role || null,
        seniority: data.seniority || null,
        education: data.education || null, 
        englishLevel: data.englishLevel || null,
        availability: data.availability || null,
        location: data.location || null,
        bio: data.bio || null,
        github: data.github || null,
        linkedin: data.linkedin || null,
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
    const val = username.toLowerCase();
    if (RESERVED_WORDS.includes(val)) {
      return { available: false };
    }
    const user = await this.prisma.user.findUnique({ where: { username: val } });
    return { available: !user };
  }
}