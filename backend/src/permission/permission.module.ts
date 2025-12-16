import { forwardRef, Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionRepository } from './permission.repository';
import { PermissionService } from './permission.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RouteModule } from 'src/route/route.module';
import { RoleModule } from 'src/role/role.module';
import { PermissionGuard } from './perimission.guard';

@Module({
  controllers: [PermissionController],
  providers: [PermissionRepository, PermissionService, PermissionGuard],
  exports: [PermissionService, PermissionGuard],
  imports: [
    PrismaModule,
    forwardRef(() => RouteModule),
    forwardRef(() => RoleModule),
  ],
})
export class PermissionModule {}
