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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiExtraModels,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import { RoleCreateDto } from './dto/role-create.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { AppError } from 'src/constants/errors';
import { ApiResponseDto } from 'src/shared/dto/api-response.dto';
import { ApiResponseSchema } from 'src/shared/helpers/swagger-response.helper';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { PermissionGuard } from 'src/permission/perimission.guard';

@ApiTags('roles')
@ApiExtraModels(ApiResponseDto, RoleResponseDto, AppError)
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // -----------------------------
  // Create role
  // -----------------------------
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ type: RoleCreateDto })
  @ApiResponse({
    status: 201,
    description: 'Role created successfully',
    schema: ApiResponseSchema(RoleResponseDto),
  })
  async create(
    @Body() dto: RoleCreateDto,
  ): Promise<ApiResponseDto<RoleResponseDto>> {
    const result = await this.roleService.createRole(dto);
    if (!result.success)
      throw new HttpException(
        ApiResponseDto.fromAppResult(result),
        result.error.statusCode,
      );
    return ApiResponseDto.fromAppResult(result);
  }

  // -----------------------------
  // Get all roles
  // -----------------------------
  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'List of roles',
    schema: ApiResponseSchema(RoleResponseDto),
  })
  async getAll(): Promise<ApiResponseDto<RoleResponseDto[]>> {
    const result = await this.roleService.getAll();
    if (!result.success)
      throw new HttpException(
        ApiResponseDto.fromAppResult(result),
        result.error.statusCode,
      );
    return ApiResponseDto.fromAppResult(result);
  }

  // -----------------------------
  // Get role by ID
  // -----------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Role found',
    schema: ApiResponseSchema(RoleResponseDto),
  })
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<RoleResponseDto>> {
    const result = await this.roleService.getById(id);
    if (!result.success)
      throw new HttpException(
        ApiResponseDto.fromAppResult(result),
        result.error.statusCode,
      );
    return ApiResponseDto.fromAppResult(result);
  }

  // -----------------------------
  // Get role with routes
  // -----------------------------
  @Get(':id/routes')
  @ApiOperation({ summary: 'Get role with its routes' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Role with routes',
    schema: ApiResponseSchema(RoleResponseDto),
  })
  async getWithRoutes(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<RoleResponseDto>> {
    const result = await this.roleService.getWithRoutes(id);
    if (!result.success)
      throw new HttpException(
        ApiResponseDto.fromAppResult(result),
        result.error.statusCode,
      );
    return ApiResponseDto.fromAppResult(result);
  }

  // -----------------------------
  // Delete role
  // -----------------------------
  @Delete(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a role safely' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Role deleted successfully',
    schema: ApiResponseSchema(Boolean),
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<boolean>> {
    const result = await this.roleService.delete(id);
    if (!result.success)
      throw new HttpException(
        ApiResponseDto.fromAppResult(result),
        result.error.statusCode,
      );
    return ApiResponseDto.fromAppResult(result);
  }
}
