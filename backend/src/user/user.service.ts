import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserCreateDto } from './dto/user-create.dto';
import { UserResponseDto } from './dto';
import argon from 'argon2';
import { UserMapper } from './user.mapper';
import { AppResult } from 'src/shared/dto/app-result.dto';
import { appError, Errors } from 'src/constants/errors';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(dto: UserCreateDto): Promise<AppResult<UserResponseDto>> {
    try {
      const existing = await this.userRepo.findByEmail(dto.email);
      if (existing) {
        return {
          success: false,
          error: appError(Errors.EMAIL_EXISTS, 'Email already exists'),
        };
      }

      const hash = await argon.hash(dto.password);
      const entity = UserMapper.toCreateEntity({ ...dto, password: hash });

      const created = await this.userRepo.create(entity);

      return { success: true, data: UserMapper.toResponseDto(created) };
    } catch (error: any) {
      return {
        success: false,
        error: appError(Errors.UNKNOWN, error),
      };
    }
  }

  async findUserById(id: number): Promise<AppResult<UserResponseDto>> {
    try {
      const user = await this.userRepo.findById(id);
      if (!user) {
        return {
          success: false,
          error: appError(Errors.USER_NOT_FOUND, 'User not found'),
        };
      }
      return { success: true, data: UserMapper.toResponseDto(user) };
    } catch (error: any) {
      return {
        success: false,
        error: appError(Errors.UNKNOWN, error),
      };
    }
  }

  async findUserByEmail(email: string): Promise<AppResult<UserResponseDto>> {
    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        return {
          success: false,
          error: appError(Errors.USER_NOT_FOUND, 'User not found'),
        };
      }
      return { success: true, data: UserMapper.toResponseDto(user) };
    } catch (error: any) {
      return {
        success: false,
        error: appError(Errors.UNKNOWN, error),
      };
    }
  }

  async softDeleteUser(id: number): Promise<AppResult<UserResponseDto>> {
    try {
      const user = await this.userRepo.findById(id);
      if (!user) {
        return {
          success: false,
          error: appError(Errors.USER_NOT_FOUND, 'User not found'),
        };
      }
      const updated = await this.userRepo.update(id, { deletedAt: new Date() });
      return { success: true, data: UserMapper.toResponseDto(updated) };
    } catch (error: any) {
      return {
        success: false,
        error: appError(Errors.UNKNOWN, error),
      };
    }
  }

  async restoreUser(id: number): Promise<AppResult<UserResponseDto>> {
    try {
      const user = await this.userRepo.findById(id);
      if (!user) {
        return {
          success: false,
          error: appError(
            Errors.USER_NOT_FOUND,
            'User not found or not deleted',
          ),
        };
      }
      const updated = await this.userRepo.update(id, { deletedAt: null });
      return { success: true, data: UserMapper.toResponseDto(updated) };
    } catch (error: any) {
      return {
        success: false,
        error: appError(Errors.UNKNOWN, error),
      };
    }
  }

  async findUserByEmailWithPassword(
    email: string,
  ): Promise<AppResult<UserResponseDto & { password: string }>> {
    try {
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        return {
          success: false,
          error: appError(Errors.USER_NOT_FOUND, 'User not found'),
        };
      }

      return {
        success: true,
        data: {
          ...UserMapper.toResponseDto(user),
          password: user.password, // only for internal verification
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: appError(Errors.UNKNOWN, error),
      };
    }
  }
}
