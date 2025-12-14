import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { RouteModule } from './route/route.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    RoleModule,
    PermissionModule,
    RouteModule,
  ],
})
export class AppModule {}
