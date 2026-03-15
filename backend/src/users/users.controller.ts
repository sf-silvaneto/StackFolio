import { Controller, Patch, Body, Req, UseGuards, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Aberto ao público: qualquer um pode ver o perfil
  @Get('profile/:username')
  async getProfile(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  // Protegido: Apenas o dono da conta (validado pelo session_token) pode editar
  @UseGuards(AuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() data: any) {
    const userId = req.user.id;
    return this.usersService.updateProfile(userId, data);
  }
}