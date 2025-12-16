import { Injectable } from '@nestjs/common';
import { CustomPrismaClient } from 'src/prisma/custom-prisma-client';
import { Prisma } from 'src/prisma/generated/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class UserRepository {
  private readonly prisma: CustomPrismaClient;

  constructor(prisma: PrismaService) {
    this.prisma = prisma.client;
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }
}
