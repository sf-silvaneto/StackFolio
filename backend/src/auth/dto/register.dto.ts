import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres.' })
  password: string;

  @IsString({ message: 'O nome de utilizador deve ser um texto.' })
  username: string; // Removi o IsOptional pois precisamos dele para o Perfil
}