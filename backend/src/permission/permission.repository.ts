import { Injectable } from '@nestjs/common';
import { CustomPrismaClient } from 'src/prisma/custom-prisma-client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionRepository {
  private readonly prisma: CustomPrismaClient;

  constructor(prisma: PrismaService) {
    this.prisma = prisma.client;
  }

  // -----------------------------
  // find relation (raw state)
  // -----------------------------
  find(roleId: number, routeId: number) {
    return this.prisma.roleRoute.findUnique({
      where: {
        roleId_routeId: { roleId, routeId },
      },
    });
  }

  // -----------------------------
  // assign route to role (smart)
  // -----------------------------
  async assign(roleId: number, routeId: number) {
    const existing = await this.find(roleId, routeId);

    // restore soft-deleted
    if (existing?.deletedAt) {
      return this.prisma.roleRoute.update({
        where: {
          roleId_routeId: { roleId, routeId },
        },
        data: {
          deletedAt: null,
        },
      });
    }

    // create new
    return this.prisma.roleRoute.create({
      data: {
        roleId,
        routeId,
      },
    });
  }

  // -----------------------------
  // revoke route from role (soft)
  // -----------------------------
  async revoke(roleId: number, routeId: number): Promise<boolean> {
    const result = await this.prisma.roleRoute.updateMany({
      where: {
        roleId,
        routeId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return result.count > 0;
  }

  // -----------------------------
  // list active routes of role
  // -----------------------------
  async getRoutes(roleId: number) {
    return this.prisma.roleRoute.findMany({
      where: {
        roleId,
      },
      include: {
        route: true,
      },
    });
  }

  // -----------------------------
  // permission check (guard-safe)
  // -----------------------------
  async hasAccess(
    roleId: number,
    path: string,
    method: string,
  ): Promise<boolean> {
    const access = await this.prisma.roleRoute.findFirst({
      where: {
        roleId,
        route: {
          path,
          method,
        },
      },
    });

    return !!access;
  }
}
