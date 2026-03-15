import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Extrai o token dos cookies processados pelo cookie-parser
    const token = request.cookies?.session_token;

    if (!token) {
      console.log('AuthGuard: Requisição sem session_token nos cookies.');
      throw new UnauthorizedException('Sessão expirada ou não autenticada.');
    }

    const session: any = await this.prisma.session.findUnique({
      where: { sessionToken: token },
      include: { user: true }
    });

    if (!session || !session.user) {
      throw new UnauthorizedException('Sessão inválida ou não encontrada.');
    }

    if (session.expiresAt < new Date()) {
      try {
        await this.prisma.session.delete({ where: { id: session.id } });
      } catch (e) {}
      throw new UnauthorizedException('A sua sessão expirou. Faça login novamente.');
    }

    request['user'] = session.user;
    return true;
  }
}