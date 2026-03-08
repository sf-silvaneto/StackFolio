import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Confirme se o caminho para o prisma.service está correto

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // 1. Ler o cookie diretamente do cabeçalho da requisição
    const cookieHeader = request.headers.cookie;
    let token = null;

    if (cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const sessionCookie = cookies.find(c => c.startsWith('session_token='));
      if (sessionCookie) {
        token = sessionCookie.split('=')[1];
      }
    }
    
    if (!token) {
      throw new UnauthorizedException('Não autenticado. Por favor, faça login.');
    }

    // 2. Procurar a sessão na base de dados
    const session = await this.prisma.session.findUnique({
      where: { sessionToken: token },
      include: { user: true } // Traz os dados do utilizador junto com a sessão
    });

    if (!session) {
      throw new UnauthorizedException('Sessão inválida ou não encontrada.');
    }

    // 3. Verificar se a sessão já expirou
    if (session.expiresAt < new Date()) {
      await this.prisma.session.delete({ where: { id: session.id } }); // Limpa do banco
      throw new UnauthorizedException('A sua sessão expirou. Faça login novamente.');
    }

    // 4. Anexar o utilizador à requisição (para os controllers poderem aceder)
    request['user'] = session.user;

    return true;
  }
}