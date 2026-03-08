import { Controller, Post, Get, Body, Res, Req, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: any) {
    const result = await this.authService.login(loginDto);

    // Configuração do Cookie Seguro
    res.cookie('session_token', result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Retornamos apenas os dados limpos
    return {
      message: result.message,
      user: result.user
    };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    // Extraímos apenas os dados necessários do objeto anexado pelo Guardião
    // Isso evita o erro de "Circular Structure" ao tentar converter o objeto 'req' completo
    const { password_hash, sessions, ...safeUser } = req.user;
    return safeUser;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: any) {
    res.cookie('session_token', '', {
      httpOnly: true,
      expires: new Date(0) 
    });
    return { message: 'Logout efetuado com sucesso.' };
  }
}