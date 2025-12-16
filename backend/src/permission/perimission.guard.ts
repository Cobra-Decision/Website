import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PermissionService } from 'src/permission/permission.service';
import { Request } from 'express';
import { UserResponseDto } from 'src/user/dto';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly permissionService: PermissionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // type request as Express Request with optional user
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: UserResponseDto }>();

    const user = request.user;
    if (!user?.roleId) {
      throw new ForbiddenException('unauthorized');
    }

    const path = request.route.path as string;
    const method = request.method;

    const result = await this.permissionService.checkAccess(
      user.roleId,
      path,
      method,
    );

    if (!result.success) {
      throw new ForbiddenException(result.error.message);
    }

    return true;
  }
}
