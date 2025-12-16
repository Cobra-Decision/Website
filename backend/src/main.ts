import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { BadRequestFilter } from './filters/bad-request.filter';
import { seedRoutes } from './route/route.seed';
import { seedRoles } from './role/role.seed';
import { seedUsers } from './user/user.seed';
import { assignPermissions } from './permission/permission.seeed';

async function bootstrap() {
  // Create Nest app
  const app = await NestFactory.create(AppModule);

  // Global setup
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new BadRequestFilter());
  app.use(cookieParser());

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addTag('doc')
    .build();

  const swaggerDocumentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, swaggerDocumentFactory, {});

  // Start server
  const port = process.env.PORT ?? 3333;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);

  // --- Seeding process ---
  console.log('🌱 Seeding routes...');
  const routes = await seedRoutes(app);

  console.log('🌱 Seeding roles...');
  const roles = await seedRoles();

  // Use admin role by name or fallback to first role
  const adminRole =
    roles.find((r) => r.name.toUpperCase() === 'ADMIN') ?? roles[0];

  console.log('🌱 Assigning permissions to admin role...');
  await assignPermissions([{ role: adminRole, routes }]);

  console.log('🌱 Seeding admin user...');
  await seedUsers([
    {
      user: {
        email: 'admin@admin.com',
        firstName: 'Admin',
        lastName: 'Pro',
        password: '123',
      },
      role: adminRole,
    },
  ]);

  console.log('✅ Seeding complete!');
}

bootstrap();
