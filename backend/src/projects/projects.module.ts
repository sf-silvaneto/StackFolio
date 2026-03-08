import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from '../prisma.service'; // Importe o PrismaService

@Module({
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    PrismaService // <-- Adicione o PrismaService aqui!
  ],
})
export class ProjectsModule {}