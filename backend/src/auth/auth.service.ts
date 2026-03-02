import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async googleLogin(token: string) {
    try {
      // 1. Descriptografa e valida o token direto com o Google
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException('Token Google inválido');

      const { email, name, picture, sub: googleId } = payload;

      // 2. Busca o usuário no banco pelo email
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      // 3. Se usuário existe e tem cadastro, realiza login completo
      if (user) {
        return {
          complete: true,
          access_token: this.jwtService.sign({ id: user.id, email: user.email }),
          user,
        };
      }

      // 4. Se não existe, envia os dados base para a tela de "Completar Cadastro" do Frontend
      return {
        complete: false,
        message: 'incomplete_registration',
        tempData: { email, name, picture, googleId },
      };
    } catch (error) {
      throw new UnauthorizedException('Falha na autenticação do Google');
    }
  }

  async completeRegistration(data: any) {
    // Criação final do usuário combinando os dados do Google + Formulário do Frontend
    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        googleId: data.googleId,
        picture: data.picture,
        nickname: data.nickname,
        bio: data.bio,
        tools: data.tools || [],
      },
    });

    // Retorna o JWT para fazer o login automático
    return {
      access_token: this.jwtService.sign({ id: newUser.id, email: newUser.email }),
      user: newUser,
    };
  }
}