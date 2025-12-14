import { PrismaClient } from './generated/client';
import {
  filterSoftDeleted,
  softDelete,
  softDeleteMany,
} from './prisma.extension';

//function to give us a prismaClient with extensions we want
export const customPrismaClient = (prismaClient: PrismaClient) => {
  return prismaClient
    .$extends(softDelete)
    .$extends(softDeleteMany)
    .$extends(filterSoftDeleted);
};

//Our Custom Prisma Client with the client set to the customPrismaClient with extension
export class PrismaClientExtended extends PrismaClient {
  customPrismaClient: CustomPrismaClient;

  get client() {
    if (!this.customPrismaClient)
      this.customPrismaClient = customPrismaClient(this);

    return this.customPrismaClient;
  }
}

export type CustomPrismaClient = ReturnType<typeof customPrismaClient>;
