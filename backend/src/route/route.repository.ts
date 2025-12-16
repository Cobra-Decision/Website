import { Injectable } from '@nestjs/common';
import { CustomPrismaClient } from 'src/prisma/custom-prisma-client';
import { Route } from 'src/prisma/generated/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RouteRepository {
  private readonly prisma: CustomPrismaClient;

  constructor(prisma: PrismaService) {
    this.prisma = prisma.client;
  }

  // -----------------------------
  // Get all routes
  // -----------------------------
  async getAll(): Promise<Route[]> {
    return this.prisma.route.findMany();
  }

  // -----------------------------
  // Get route by ID
  // -----------------------------
  async findById(id: number): Promise<Route | null> {
    return this.prisma.route.findUnique({ where: { id } });
  }

  // -----------------------------
  // Create a new route
  // -----------------------------
  async create(
    path: string,
    method: string,
    description: string,
  ): Promise<Route> {
    return this.prisma.route.create({
      data: { path, method, description },
    });
  }

  // -----------------------------
  // Update an existing route
  // -----------------------------
  async update(id: number, data: Partial<Route>): Promise<Route> {
    return this.prisma.route.update({
      where: { id },
      data,
    });
  }

  // -----------------------------
  // Delete a route
  // -----------------------------
  async delete(id: number): Promise<Route> {
    return this.prisma.route.delete({ id });
  }

  // -----------------------------
  // Check if a route exists
  // -----------------------------
  async exists(path: string, method: string): Promise<boolean> {
    const route = await this.prisma.route.findFirst({
      where: { path, method },
      select: { id: true },
    });
    return !!route;
  }
}
