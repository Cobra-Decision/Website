import { RouteResponseDto } from './dto/route-response.dto';
import { Route } from 'src/prisma/generated/client';
export class RouteMapper {
  public static toRouteResponse(route: Route): RouteResponseDto {
    return {
      id: route.id,
      path: route.path,
      method: route.method,
      description: route.description,
      createdAt: route.createdAt,
      updatedAt: route.updatedAt,
    };
  }
}
