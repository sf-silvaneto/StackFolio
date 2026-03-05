import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  customLink?: string;

  @IsOptional()
  @IsString()
  altEmail?: string;

  @IsOptional()
  @IsString()
  primaryEmailChoice?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isWhatsApp?: boolean;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;
  
  @IsOptional()
  @IsBoolean()
  profileVisibility?: boolean;

  @IsOptional()
  @IsBoolean()
  publicEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  showLocation?: boolean;

  @IsOptional()
  @IsBoolean()
  showSocial?: boolean;
}