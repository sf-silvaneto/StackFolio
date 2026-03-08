import { Controller, Post, Get, Body, Res, Req, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard'; // Caso você esteja usando o Guard para a rota /me

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

    res.cookie('session_token', result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: result.message, user: result.user };
  }

  // --- E-MAIL VERIFICATION ---
  @Post('send-email-code')
  async sendEmailCode(@Body('email') email: string) {
    return this.authService.sendEmailCode(email);
  }

  @Post('verify-email-code')
  async verifyEmailCode(@Body('email') email: string, @Body('code') code: string) {
    return this.authService.verifyEmailCode(email, code);
  }

  // --- AVAILABILITY CHECKS ---
  @Get('check-email')
  async checkEmail(@Query('email') email: string) {
    return this.authService.checkEmail(email);
  }

  @Get('check-username')
  async checkUsername(@Query('username') username: string) {
    return this.authService.checkUsername(username);
  }

  // --- USER DATA & SESSION ---
  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    const { password_hash, sessions, ...safeUser } = req.user;
    return safeUser;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: any) {
    res.cookie('session_token', '', { httpOnly: true, expires: new Date(0) });
    return { message: 'Logout efetuado com sucesso.' };
  }
}