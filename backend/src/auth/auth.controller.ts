import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Rota para o Login do Google
  @HttpCode(HttpStatus.OK)
  @Post('google')
  async signInGoogle(@Body('token') token: string) {
    return this.authService.signInGoogle(token);
  }
}