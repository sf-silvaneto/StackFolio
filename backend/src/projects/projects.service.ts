import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; description: string; userId: string }) {
    return this.prisma.project.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      include: { user: true }, // Mostra quem é o dono do projeto
    });
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.project.delete({
      where: { id },
    });
  }
}