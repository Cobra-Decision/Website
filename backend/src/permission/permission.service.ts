import { Injectable } from '@nestjs/common';
import { PermissionRepository } from './permission.repository';
import { AssignRouteDto } from './dto/assign-route.dto';
import { appError, Errors } from 'src/constants/errors';
import { AppResult } from 'src/shared/dto/app-result.dto';
import { RouteService } from 'src/route/route.service';
import { RoleService } from 'src/role/role.service';
import { RevokeRouteDto } from './dto/revoke-route.dto';

@Injectable()
export class PermissionService {
  constructor(
    private readonly repo: PermissionRepository,
    private readonly routeService: RouteService,
    private readonly roleService: RoleService,
  ) {}

  async assignRouteToRole(dto: AssignRouteDto): Promise<AppResult<boolean>> {
    const roleExists = await this.roleService.getById(dto.roleId);
    if (!roleExists.success) {
      return {
        success: false,
        error: roleExists.error,
      };
    }

    const routeExists = await this.routeService.getById(dto.routeId);
    if (!routeExists.success) {
      return {
        success: false,
        error: routeExists.error,
      };
    }

    const routes = await this.repo.find(dto.roleId, dto.routeId);
    if (routes) {
      return {
        success: false,
        error: appError(Errors.ROLE_ROUTE_EXISTS),
      };
    }

    await this.repo.assign(dto.roleId, dto.routeId);
    return { success: true, data: true };
  }

  async revokeRouteFromRole(dto: RevokeRouteDto): Promise<AppResult<boolean>> {
    const roleExists = await this.roleService.getById(dto.roleId);
    if (!roleExists.success) {
      return {
        success: false,
        error: roleExists.error,
      };
    }

    const routeExists = await this.routeService.getById(dto.routeId);
    if (!routeExists.success) {
      return {
        success: false,
        error: routeExists.error,
      };
    }

    const route = await this.repo.find(dto.roleId, dto.routeId);
    if (!route) {
      return {
        success: false,
        error: appError(Errors.ROUTE_NOT_FOUND),
      };
    }

    await this.repo.revoke(dto.roleId, dto.routeId);
    return { success: true, data: true };
  }

  async checkAccess(
    roleId: number,
    path: string,
    method: string,
  ): Promise<AppResult<boolean>> {
    const hasAccess = await this.repo.hasAccess(roleId, path, method);

    if (!hasAccess) {
      return {
        success: false,
        error: appError(Errors.FORBIDDEN_OPERATION),
      };
    }

    return { success: true, data: true };
  }
}
