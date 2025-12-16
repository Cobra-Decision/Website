import { Injectable } from '@nestjs/common';
import { CustomPrismaClient } from 'src/prisma/custom-prisma-client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleRepository {
  private readonly prisma: CustomPrismaClient;

  constructor(prismaService: PrismaService) {
    this.prisma = prismaService.client;
  }

  getAll() {
    return this.prisma.role.findMany();
  }

  findById(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  findByTitle(title: string) {
    return this.prisma.role.findFirst({
      where: { title },
    });
  }

  findByIdWithRoutes(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
      include: {
        routes: {
          include: {
            route: true,
          },
        },
      },
    });
  }
  create(name: string, title: string, description: string) {
    return this.prisma.role.create({
      data: { title, name, description },
    });
  }

  delete(id: number) {
    return this.prisma.role.delete({ id });
  }

  async roleHasUsers(roleId: number): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { roleId },
      select: { id: true },
    });

    return !!user;
  }
}
