import { Prisma } from './generated/client';

//extension for soft delete
export const softDelete = Prisma.defineExtension({
  name: 'softDelete',
  model: {
    $allModels: {
      delete<M, A>(
        this: M,
        where: Prisma.Args<M, 'delete'>['where'],
      ): Prisma.Result<M, A, 'update'> {
        console.log('delete');

        const context = Prisma.getExtensionContext(this);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return (context as any).update({
          where,
          data: {
            deletedAt: new Date(),
          },
        });
      },
    },
  },
});

//extension for soft delete Many
export const softDeleteMany = Prisma.defineExtension({
  name: 'softDeleteMany',
  model: {
    $allModels: {
      deleteMany<M, A>(
        this: M,
        where: Prisma.Args<M, 'deleteMany'>['where'],
      ): Prisma.Result<M, A, 'updateMany'> {
        const context = Prisma.getExtensionContext(this);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
        return (context as any).updateMany({
          where,
          data: {
            deletedAt: new Date(),
          },
        });
      },
    },
  },
});

//extension for filtering soft deleted rows from queries
export const filterSoftDeleted = Prisma.defineExtension({
  name: 'filterSoftDeleted',
  query: {
    $allModels: {
      async $allOperations({ operation, args, query }) {
        if (
          operation === 'findUnique' ||
          operation === 'findFirst' ||
          operation === 'findMany'
        ) {
          args.where = { ...args.where, deletedAt: null };
          return query(args);
        }
        return query(args);
      },
    },
  },
});
