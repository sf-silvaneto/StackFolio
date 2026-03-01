import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service'; // Verifique se a pasta é 'prisma'
import { JwtService } from '@nestjs/jwt';

const client = new OAuth2Client("952392498435-c1bebtgqk4coukt5spdnf4c31rg7cppo.apps.googleusercontent.com");

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async signInGoogle(token: string) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: "952392498435-c1bebtgqk4coukt5spdnf4c31rg7cppo.apps.googleusercontent.com",
      });
      
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        throw new UnauthorizedException('Dados do Google inválidos');
      }

      let user = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: payload.email,
            name: payload.name || 'Usuário Google',
            password: '', 
          },
        });
      }

      const access_token = this.jwt.sign({ 
        sub: user.id, 
        email: user.email 
      });

      return {
        access_token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Falha na autenticação com Google');
    }
  }
}