// backend/src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' }) email: string;
  @IsString() @MinLength(8) password: string;
  @IsString() @MinLength(5) username: string;
  @IsString() @MinLength(5) displayName: string;
  @IsString() @MinLength(15) fullName: string;
  
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() birthDate?: string;
  @IsOptional() @IsString() role?: string;
  @IsOptional() @IsString() seniority?: string;
  @IsOptional() @IsString() englishLevel?: string;
  @IsOptional() @IsString() availability?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() tools?: string; 
}