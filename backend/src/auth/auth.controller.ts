import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto, UserResponseDto } from 'src/user/dto';
import { ApiResponseDto } from 'src/shared/dto/api-response.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { AppError } from 'src/constants/errors';
import type { Response } from 'express';

@ApiTags('auth')
@ApiExtraModels(ApiResponseDto, UserResponseDto, AppError)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserResponseDto) },
            error: { $ref: getSchemaPath(AppError) },
          },
        },
      ],
    },
  })
  async signup(
    @Body() dto: UserCreateDto,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const result = await this.authService.signup(dto);
    if (!result.success) {
      throw new HttpException(result.error, result.error.statusCode);
    }
    return { success: true, error: null, data: result.data };
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ApiResponseDto) },
        {
          properties: {
            data: { $ref: getSchemaPath(UserResponseDto) },
            error: { $ref: getSchemaPath(AppError) },
          },
        },
      ],
    },
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const result = await this.authService.login(dto);
    if (!result.success) {
      throw new HttpException(result.error, result.error.statusCode);
    }
    const { token, ...user } = result.data;
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // HTTPS
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    return { success: true, error: null, data: user };
  }
}
