import { forwardRef, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleRepository } from './role.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  providers: [RoleService, RoleRepository, JwtAuthGuard],
  controllers: [RoleController],
  exports: [RoleService],
  imports: [forwardRef(() => PermissionModule), PrismaModule],
})
export class RoleModule {}
