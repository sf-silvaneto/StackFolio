import { Controller, Post, Get, Body, Res, Req, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
// A correção principal está na linha abaixo: importando como namespace
import * as Express from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto, 
    @Res({ passthrough: true }) res: Express.Response // Usando o namespace aqui
  ) {
    const result = await this.authService.login(loginDto);

    res.cookie('session_token', result.sessionToken, {
      httpOnly: true,
      secure: false, // Mantenha false para localhost
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return { message: result.message, user: result.user };
  }

  @Post('send-email-code')
  async sendEmailCode(@Body('email') email: string) {
    return this.authService.sendEmailCode(email);
  }

  @Post('verify-email-code')
  async verifyEmailCode(@Body('email') email: string, @Body('code') code: string) {
    return this.authService.verifyEmailCode(email, code);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: any) {
    return this.authService.resetPassword(body);
  }

  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    return this.authService.checkEmail(email);
  }

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    return this.authService.checkUsername(username);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, sessions, ...safeUser } = req.user;
    return safeUser;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Express.Response) { // Usando o namespace aqui também
    res.clearCookie('session_token', { path: '/' });
    return { message: 'Logout efetuado com sucesso.' };
  }
}