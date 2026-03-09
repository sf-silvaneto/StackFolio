import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // FUNÇÃO ADICIONADA: Encontra o usuário pelo link do perfil (username)
  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) throw new NotFoundException('Utilizador não encontrado');

    // Removemos a senha por segurança antes de enviar para o frontend
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(userId: string, data: any) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilizador não encontrado');

    if (data.username && data.username !== user.username) {
      const existing = await this.prisma.user.findFirst({
        where: { 
          username: data.username,
          NOT: { id: userId } 
        }
      });
      if (existing) throw new ConflictException('Este Link/Username já está em uso.');
    }

    const updateData = {
      fullName: data.fullName !== undefined ? data.fullName : user.fullName,
      displayName: data.displayName !== undefined ? data.displayName : user.displayName,
      username: data.username !== undefined ? data.username : user.username,
      role: data.role !== undefined ? data.role : user.role,
      seniority: data.seniority !== undefined ? data.seniority : user.seniority,
      englishLevel: data.englishLevel !== undefined ? data.englishLevel : user.englishLevel,
      location: data.location !== undefined ? data.location : user.location,
      availability: data.availability !== undefined ? data.availability : user.availability,
      bio: data.bio !== undefined ? data.bio : user.bio,
      profileImg: data.profileImg !== undefined ? data.profileImg : user.profileImg,
      coverImg: data.coverImg !== undefined ? data.coverImg : user.coverImg,
      phone: data.phone !== undefined ? data.phone : user.phone,
      gender: data.gender !== undefined ? data.gender : user.gender,
      github: data.github !== undefined ? data.github : user.github,
      linkedin: data.linkedin !== undefined ? data.linkedin : user.linkedin,
      birthDate: data.birthDate ? new Date(data.birthDate) : user.birthDate,
      tools: data.tools ? (typeof data.tools === 'string' ? data.tools : JSON.stringify(data.tools)) : user.tools,
      education: data.education ? (typeof data.education === 'string' ? data.education : JSON.stringify(data.education)) : user.education,
    };

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    const { password_hash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}