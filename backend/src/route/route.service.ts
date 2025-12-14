import { Injectable } from '@nestjs/common';
import { RouteRepository } from './route.repository';
import { RouteCreateDto } from './dto/route-create.dto';
import { RouteResponseDto } from './dto/route-response.dto';
import { RouteMapper } from './route.mapper';
import { AppResult } from 'src/shared/dto/app-result.dto';
import { appError, Errors } from 'src/constants/errors';

@Injectable()
export class RouteService {
  constructor(private readonly routeRepo: RouteRepository) {}

  // -----------------------------
  // Create a new route
  // -----------------------------
  async create(dto: RouteCreateDto): Promise<AppResult<RouteResponseDto>> {
    try {
      const exists = await this.routeRepo.exists(dto.path, dto.method);
      if (exists) {
        return { success: false, error: appError(Errors.ROUTE_EXISTS) };
      }

      const route = await this.routeRepo.create(
        dto.path,
        dto.method,
        dto.description,
      );
      return { success: true, data: RouteMapper.toRouteResponse(route) };
    } catch (error: any) {
      return { success: false, error: appError(Errors.UNKNOWN, error) };
    }
  }

  // -----------------------------
  // Get all routes
  // -----------------------------
  async getAll(): Promise<AppResult<RouteResponseDto[]>> {
    try {
      const routes = await this.routeRepo.getAll();
      return {
        success: true,
        data: routes.map((r) => RouteMapper.toRouteResponse(r)),
      };
    } catch (error: any) {
      return { success: false, error: appError(Errors.UNKNOWN, error) };
    }
  }

  // -----------------------------
  // Get route by ID
  // -----------------------------
  async getById(id: number): Promise<AppResult<RouteResponseDto>> {
    try {
      const route = await this.routeRepo.findById(id);
      if (!route) {
        return { success: false, error: appError(Errors.ROUTE_NOT_FOUND) };
      }
      return { success: true, data: RouteMapper.toRouteResponse(route) };
    } catch (error: any) {
      return { success: false, error: appError(Errors.UNKNOWN, error) };
    }
  }

  // -----------------------------
  // Update route
  // -----------------------------
  async update(
    id: number,
    dto: Partial<RouteCreateDto>,
  ): Promise<AppResult<RouteResponseDto>> {
    try {
      const route = await this.routeRepo.findById(id);
      if (!route) {
        return { success: false, error: appError(Errors.ROUTE_NOT_FOUND) };
      }

      const updated = await this.routeRepo.update(id, dto);
      return { success: true, data: RouteMapper.toRouteResponse(updated) };
    } catch (error: any) {
      return { success: false, error: appError(Errors.UNKNOWN, error) };
    }
  }

  // -----------------------------
  // Delete route
  // -----------------------------
  async delete(id: number): Promise<AppResult<boolean>> {
    try {
      const route = await this.routeRepo.findById(id);
      if (!route) {
        return { success: false, error: appError(Errors.ROUTE_NOT_FOUND) };
      }

      await this.routeRepo.delete(id);
      return { success: true, data: true };
    } catch (error: any) {
      return { success: false, error: appError(Errors.UNKNOWN, error) };
    }
  }
}
