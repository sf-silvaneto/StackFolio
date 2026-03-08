import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: string, data: any) {
    // 1. Verificar se o utilizador existe
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilizador não encontrado');

    // 2. Verificar se o username (Link) já existe para outro usuário
    if (data.username && data.username !== user.username) {
      const existing = await this.prisma.user.findFirst({
        where: { 
          username: data.username,
          NOT: { id: userId } 
        }
      });
      if (existing) throw new ConflictException('Este Link/Username já está em uso.');
    }

    // 3. Preparar os dados (Fidelidade total ao seu design de Perfil)
    const updateData = {
      fullName: data.fullName,
      displayName: data.fullName || data.displayName || user.username,
      username: data.username,
      role: data.role,
      seniority: data.seniority,
      englishLevel: data.englishLevel,
      location: data.location,
      availability: data.availability,
      bio: data.bio,
      profileImg: data.profileImg,
      coverImg: data.coverImg,
      // Prioridade 99% para a estrutura do CompleteProfile (JSON Strings)
      tools: data.tools ? JSON.stringify(data.tools) : user.tools,
      education: data.education ? JSON.stringify(data.education) : user.education,
      contacts: data.contacts ? JSON.stringify(data.contacts) : user.contacts,
    };

    // 4. Atualiza no banco de dados
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { password_hash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}