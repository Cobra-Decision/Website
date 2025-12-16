import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiExtraModels,
} from '@nestjs/swagger';
import { RouteService } from './route.service';
import { RouteCreateDto } from './dto/route-create.dto';
import { RouteResponseDto } from './dto/route-response.dto';
import { AppError } from 'src/constants/errors';
import { ApiResponseDto } from 'src/shared/dto/api-response.dto';
import { ApiResponseSchema } from 'src/shared/helpers/swagger-response.helper';

@ApiTags('routes')
@ApiExtraModels(ApiResponseDto, RouteResponseDto, AppError)
@Controller('routes')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  // -----------------------------
  // Create route
  // -----------------------------
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new route' })
  @ApiBody({ type: RouteCreateDto })
  @ApiResponse({
    status: 201,
    description: 'Route created successfully',
    schema: ApiResponseSchema(RouteResponseDto),
  })
  async create(
    @Body() dto: RouteCreateDto,
  ): Promise<ApiResponseDto<RouteResponseDto>> {
    const result = await this.routeService.create(dto);
    if (!result.success) {
      throw new HttpException(result.error, result.error.statusCode);
    }
    return new ApiResponseDto(true, result.data, null);
  }

  // -----------------------------
  // Get all routes
  // -----------------------------
  @Get()
  @ApiOperation({ summary: 'Get all routes' })
  @ApiResponse({
    status: 200,
    description: 'List of routes',
    schema: ApiResponseSchema(RouteResponseDto),
  })
  async getAll(): Promise<ApiResponseDto<RouteResponseDto[]>> {
    const result = await this.routeService.getAll();
    if (!result.success) {
      throw new HttpException(
        ApiResponseDto.fromAppResult(result),
        result.error.statusCode,
      );
    }
    return ApiResponseDto.fromAppResult(result);
  }

  // -----------------------------
  // Get route by ID
  // -----------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get route by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Route found',
    schema: ApiResponseSchema(RouteResponseDto),
  })
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<RouteResponseDto>> {
    const result = await this.routeService.getById(id);
    if (!result.success) {
      throw new HttpException(
        ApiResponseDto.fromAppResult(result),
        result.error.statusCode,
      );
    }
    return ApiResponseDto.fromAppResult(result);
  }

  // -----------------------------
  // Delete route
  // -----------------------------
  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a route safely' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Route deleted successfully',
    schema: ApiResponseSchema(Boolean),
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<boolean>> {
    const result = await this.routeService.delete(id);
    if (!result.success) {
      throw new HttpException(
        ApiResponseDto.fromAppResult(result),
        result.error.statusCode,
      );
    }
    return ApiResponseDto.fromAppResult(result);
  }
}
