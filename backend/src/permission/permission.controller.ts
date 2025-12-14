import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PermissionService } from './permission.service';
import { AssignRouteDto } from './dto/assign-route.dto';

import { ApiResponseDto } from 'src/shared/dto/api-response.dto';
import { ApiResponseSchema } from 'src/shared/helpers/swagger-response.helper';
import { AppError } from 'src/constants/errors';

@ApiTags('permissions')
@ApiExtraModels(ApiResponseDto, AppError)
@Controller('permissions')
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  // -----------------------------
  // Assign route to role
  // -----------------------------
  @Post('assign')
  @HttpCode(201)
  @ApiOperation({ summary: 'Assign route to role' })
  @ApiBody({ type: AssignRouteDto })
  @ApiResponse({
    status: 201,
    description: 'Route assigned to role',
    schema: ApiResponseSchema(Boolean),
  })
  async assign(@Body() dto: AssignRouteDto): Promise<ApiResponseDto<boolean>> {
    const result = await this.service.assignRouteToRole(dto);

    if (!result.success) {
      throw new HttpException(
        ApiResponseDto.fromAppResult(result),
        result.error.statusCode,
      );
    }

    return ApiResponseDto.fromAppResult(result);
  }

  // -----------------------------
  // Revoke route from role
  // -----------------------------
  @Post('revoke')
  @HttpCode(200)
  @ApiOperation({ summary: 'Revoke route from role' })
  @ApiBody({ type: AssignRouteDto })
  @ApiResponse({
    status: 200,
    description: 'Route revoked from role',
    schema: ApiResponseSchema(Boolean),
  })
  async revoke(@Body() dto: AssignRouteDto): Promise<ApiResponseDto<boolean>> {
    const result = await this.service.revokeRouteFromRole(dto);

    if (!result.success) {
      throw new HttpException(
        ApiResponseDto.fromAppResult(result),
        result.error.statusCode,
      );
    }

    return ApiResponseDto.fromAppResult(result);
  }
}
