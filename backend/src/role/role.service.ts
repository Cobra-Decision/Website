import { Injectable } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { RoleCreateDto } from './dto/role-create.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { RoleMapper } from './role.mapper';
import { appError, Errors } from 'src/constants/errors';
import { AppResult } from 'src/shared/dto/app-result.dto';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepository) {}

  // -----------------------------
  // create role
  // -----------------------------
  async createRole(dto: RoleCreateDto): Promise<AppResult<RoleResponseDto>> {
    try {
      const exists = await this.roleRepo.findByTitle(dto.title);
      if (exists) {
        return {
          success: false,
          error: appError(Errors.ROLE_EXISTS),
        };
      }

      const role = await this.roleRepo.create(
        dto.name,
        dto.title,
        dto.description,
      );
      return {
        success: true,
        data: RoleMapper.toRoleResponse(role),
      };
    } catch (error) {
      return {
        success: false,
        error: appError(Errors.UNKNOWN, error),
      };
    }
  }

  // -----------------------------
  // get all roles
  // -----------------------------
  async getAll(): Promise<AppResult<RoleResponseDto[]>> {
    try {
      const roles = await this.roleRepo.getAll();
      return {
        success: true,
        data: roles.map((r) => RoleMapper.toRoleResponse(r)),
      };
    } catch (error) {
      return {
        success: false,
        error: appError(Errors.UNKNOWN, error),
      };
    }
  }

  // -----------------------------
  // get role by id
  // -----------------------------
  async getById(id: number): Promise<AppResult<RoleResponseDto>> {
    try {
      const role = await this.roleRepo.findById(id);
      if (!role) {
        return {
          success: false,
          error: appError(Errors.ROLE_NOT_FOUND, 'Role not found'),
        };
      }

      return {
        success: true,
        data: RoleMapper.toRoleResponse(role),
      };
    } catch (error) {
      return {
        success: false,
        error: appError(Errors.UNKNOWN, error),
      };
    }
  }

  // -----------------------------
  // get role with routes
  // -----------------------------
  async getWithRoutes(id: number): Promise<AppResult<RoleResponseDto>> {
    try {
      const role = await this.roleRepo.findByIdWithRoutes(id);
      if (!role) {
        return {
          success: false,
          error: appError(Errors.ROLE_NOT_FOUND),
        };
      }

      return {
        success: true,
        data: RoleMapper.toRoleResponse(role),
      };
    } catch (error) {
      return {
        success: false,
        error: appError(Errors.UNKNOWN, error),
      };
    }
  }

  // -----------------------------
  // delete role (safe)
  // -----------------------------
  async delete(id: number): Promise<AppResult<boolean>> {
    try {
      // Find the role
      const role = await this.roleRepo.findById(id);
      if (!role) {
        return {
          success: false,
          error: appError(Errors.ROLE_NOT_FOUND),
        };
      }

      // Check if role has users
      const roleHasUser = await this.roleRepo.roleHasUsers(id);

      if (roleHasUser) {
        return {
          success: false,
          error: appError(
            Errors.ROLE_HAS_USERS,
            'Role is assigned to one or more users',
          ),
        };
      }

      // Delete the role
      await this.roleRepo.delete(id);

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      return {
        success: false,
        error: appError(Errors.UNKNOWN, error),
      };
    }
  }
}
