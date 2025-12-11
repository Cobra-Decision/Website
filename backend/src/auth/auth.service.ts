import { Injectable } from '@nestjs/common';
import { UserCreateDto, UserResponseDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { AppResult } from 'src/shared/dto/app-result.dto';
import { appError, Errors } from 'src/constants/errors';
import argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(input: UserCreateDto): Promise<AppResult<UserResponseDto>> {
    try {
      const created = await this.userService.createUser(input);
      return created;
    } catch (err: any) {
      return {
        success: false,
        error: appError(err?.code ?? Errors.UNKNOWN, err),
      };
    }
  }

  async login(
    input: LoginDto,
  ): Promise<AppResult<UserResponseDto & { token: string }>> {
    try {
      const userResult = await this.userService.findUserByEmailWithPassword(
        input.email,
      );

      if (!userResult.success || !userResult.data) {
        return {
          success: false,
          error: appError(Errors.INVALID_CREDENTIALS, 'User not found!'),
        };
      }

      const isPasswordValid = await argon.verify(
        userResult.data.password,
        input.password,
      );

      if (!isPasswordValid) {
        return {
          success: false,
          error: appError(Errors.INVALID_CREDENTIALS, 'Incorrect password!'),
        };
      }

      // Remove password before returning to client
      const { password: _, ...safeUser } = userResult.data;

      const token = await this.jwtService.signAsync(safeUser);
      return { success: true, data: { ...safeUser, token } };
    } catch (error: any) {
      return {
        success: false,
        error: appError(Errors.UNKNOWN, error),
      };
    }
  }
}
