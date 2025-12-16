import { Role, Route } from 'src/prisma/generated/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface RouteSeed {
  id: number;
  path: string;
  method: string;
}

interface PermissionAssignment {
  role: Role;
  routes?: Route[];
}

export async function assignPermissions(assignments: PermissionAssignment[]) {
  const prisma = new PrismaService();

  try {
    for (const assignment of assignments) {
      const { role, routes } = assignment;

      // Get routes to assign
      const routesToAssign: RouteSeed[] =
        routes && routes.length ? routes : await prisma.route.findMany();

      console.log(
        `Assigning ${routesToAssign.length} routes to roleId: ${role.id}`,
      );

      for (const route of routesToAssign) {
        try {
          await prisma.roleRoute.upsert({
            where: {
              roleId_routeId: {
                roleId: role.id,
                routeId: route.id,
              },
            },
            create: {
              roleId: role.id,
              routeId: route.id,
            },
            update: {}, // do nothing if already exists
          });
        } catch (err) {
          console.error(
            `❌ Failed to assign route [${route.method}] ${route.path} to roleId ${role.id}`,
            err,
          );
        }
      }

      console.log(`✅ Permissions assigned for role ${role.name}`);
    }

    console.log('All permissions assignments complete.');
  } catch (err) {
    console.error('❌ Failed to assign permissions:', err);
  } finally {
    await prisma.$disconnect();
  }
}
