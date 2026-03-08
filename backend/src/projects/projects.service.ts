import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; description: string; userId: string; tools?: string }) {
    return this.prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        userId: data.userId,
        // Garante que tools seja uma string (mesmo que vazia) para o SQLite
        tools: data.tools || "", 
      },
    });
  }

  async findAll() {
    // Retorna todos os projetos, ideal para a página inicial ou explorador
    return this.prisma.project.findMany({
      include: {
        user: {
          select: {
            displayName: true,
            username: true,
            profileImg: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        user: true, // Traz os dados do autor do projeto junto
      },
    });
  }

  async findByUsername(username: string) {
    // Novo método útil para mostrar projetos na página de perfil de alguém
    return this.prisma.project.findMany({
      where: {
        user: {
          username: username,
        },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}