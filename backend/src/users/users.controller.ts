import { Controller, Patch, Body, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService, private prisma: PrismaService) {}

  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() data: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('Não autorizado');

    const token = authHeader.split(' ')[1];
    const session = await this.prisma.session.findUnique({
      where: { sessionToken: token },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Sessão expirada');
    }

    return this.usersService.updateProfile(session.userId, data);
  }
}