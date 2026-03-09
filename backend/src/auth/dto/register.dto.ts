import { IsEmail, IsString, MinLength, MaxLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'O e-mail fornecido não é válido.' }) 
  email: string;

  @IsString() 
  @MinLength(8) 
  @MaxLength(20)
  @Matches(/^\S+$/, { message: 'A senha não pode conter espaços.' })
  password: string;

  @IsString() 
  @MinLength(5) 
  @MaxLength(15)
  @Matches(/^[a-z0-9]+$/, { message: 'O username deve conter apenas letras minúsculas e números.' })
  username: string;

  @IsString() 
  @MinLength(5) 
  @MaxLength(15)
  displayName: string;

  @IsString() 
  @MinLength(15) 
  @MaxLength(60)
  fullName: string;
  
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() gender?: string;     // <-- ADICIONADO
  @IsOptional() @IsString() birthDate?: string;
  
  @IsOptional() @IsString() @MaxLength(25) role?: string;
  @IsOptional() @IsString() seniority?: string;
  @IsOptional() @IsString() education?: string; 
  @IsOptional() @IsString() englishLevel?: string;
  @IsOptional() @IsString() availability?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() @MaxLength(500) bio?: string;
  
  @IsOptional() @IsString() @MaxLength(30) github?: string;
  @IsOptional() @IsString() @MaxLength(30) linkedin?: string;
  
  @IsOptional() @IsString() tools?: string; 
}