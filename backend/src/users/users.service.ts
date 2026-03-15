import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { projects: true },
    });

    if (!user) throw new NotFoundException('Utilizador não encontrado');

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilizador não encontrado');

    // Validação de Username Único
    if (data.username && data.username !== user.username) {
      const existing = await this.prisma.user.findFirst({
        where: { username: data.username, NOT: { id: userId } }
      });
      if (existing) throw new ConflictException('Este Link/Username já está em uso.');
    }

    // Processamento de Imagens (Base64 -> Arquivo)
    let profileImgPath = data.profileImg;
    if (data.profileImg && data.profileImg.startsWith('data:image')) {
      profileImgPath = this.saveBase64Image(userId, data.profileImg, 'avatar');
    }

    let coverImgPath = data.coverImg;
    if (data.coverImg && data.coverImg.startsWith('data:image')) {
      coverImgPath = this.saveBase64Image(userId, data.coverImg, 'cover');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: data.fullName,
        displayName: data.displayName,
        role: data.role, // MAPEA PARA O CAMPO DO SCHEMA.PRISMA
        seniority: data.seniority,
        englishLevel: data.englishLevel,
        location: data.location,
        availability: data.availability,
        bio: data.bio,
        github: data.github,
        linkedin: data.linkedin,
        profileImg: profileImgPath,
        coverImg: coverImgPath,
        tools: data.tools, // Já vem como string do CompleteRegistration no Front
        education: data.education,
        experience: data.experience,
      },
      include: { projects: true }
    });
  }

  private saveBase64Image(userId: string, base64Str: string, type: string): string {
    try {
      const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `${type}-${userId}-${Date.now()}.png`;
      
      const uploadDir = join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

      fs.writeFileSync(join(uploadDir, fileName), buffer);
      
      // Retorna a URL para o frontend acessar
      return `http://localhost:3000/uploads/${fileName}`;
    } catch (e) {
      console.error("Erro ao salvar imagem:", e);
      return base64Str;
    }
  }
}