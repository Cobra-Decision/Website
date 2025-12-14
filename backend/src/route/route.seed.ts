import { INestApplication } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Router, RequestHandler } from 'express';
import { Route } from 'src/prisma/generated/client';

interface RouteInfo {
  path: string;
  method: string;
}

// Express Layer in router stack
interface ExpressLayer {
  route?: {
    path: string;
    stack: Array<{ method: string }>;
  };
  name: string;
  handle: (Router & { stack?: ExpressLayer[] }) | RequestHandler;
}

export async function seedRoutes(app: INestApplication) {
  const prisma = new PrismaService();

  // Get Express instance
  const server = app.getHttpAdapter().getInstance() as Router;

  // Access the router stack
  const routerStack = (server as any).router?.stack as
    | ExpressLayer[]
    | undefined;

  if (!routerStack) {
    console.warn('Router stack not found. Make sure you are using Express.');
    return;
  }

  // Extract all routes
  const availableRoutes: RouteInfo[] = routerStack
    .map((layer) => {
      if (layer.route && !layer.route.path.includes('swagger')) {
        return {
          path: layer.route.path,
          method: layer.route.stack[0].method.toUpperCase(),
        };
      }
      return undefined;
    })
    .filter((r): r is RouteInfo => r !== undefined); // Type guard

  if (!availableRoutes.length) {
    console.warn('No routes found to seed.');
    return;
  }

  console.log(`Found ${availableRoutes.length} route(s). Seeding into DB...`);

  const routes: Route[] = [];
  for (const r of availableRoutes) {
    try {
      const route = await prisma.route.upsert({
        where: { path_method: { path: r.path, method: r.method } },
        create: { path: r.path, method: r.method, description: '' },
        update: { updatedAt: new Date() },
      });

      routes.push(route);
      console.log(`✅ Seeded route: [${r.method}] ${r.path}`);
    } catch (err) {
      console.error(`❌ Failed to insert route [${r.method}] ${r.path}`, err);
    }
  }

  console.log('All routes seeding complete.');
  return routes;
}
