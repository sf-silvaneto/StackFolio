import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    let hashedPassword = data.password;
    // Verifica se a senha existe (pois quem loga com Google pode não ter)
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }
    
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  // Método para o Login encontrar o usuário
  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // NOVO: Busca o usuário pelo ID (usado na tela de Settings)
  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // NOVO: Atualiza as configurações do usuário
  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
}