import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponseDto } from 'src/user/dto';
import { ApiResponseDto } from 'src/shared/dto/api-response.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { AppError } from 'src/constants/errors';
import { ApiResponseSchema } from 'src/shared/helpers/swagger-response.helper';
import type { Response } from 'express';
import { SignupDto } from './dto/signup.dto';

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
    schema: ApiResponseSchema(UserResponseDto),
  })
  async signup(
    @Body() dto: SignupDto,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const result = await this.authService.signup(dto);
    if (!result.success) {
      throw new HttpException(
        ApiResponseDto.fromAppResult(result),
        result.error.statusCode,
      );
    }
    return new ApiResponseDto(true, result.data, null);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    schema: ApiResponseSchema(UserResponseDto),
  })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const result = await this.authService.login(dto);
    if (!result.success) {
      throw new HttpException(
        ApiResponseDto.fromAppResult(result),
        result.error.statusCode,
      );
    }

    const { token, ...user } = result.data;

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // set to true in production with HTTPS
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    return new ApiResponseDto(true, user, null);
  }
}
