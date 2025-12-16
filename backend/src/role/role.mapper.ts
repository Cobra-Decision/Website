import { Role, Route, RoleRoute } from 'src/prisma/generated/client';
import { RoleResponseDto } from './dto/role-response.dto';
import { RouteMapper } from 'src/route/route.mapper';

type RoleWithRoutes = Role & {
  routes?: (RoleRoute & { route: Route })[];
};

export class RoleMapper {
  public static toRoleResponse(role: RoleWithRoutes): RoleResponseDto {
    return {
      id: role.id,
      title: role.title,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
      routes: role.routes
        ? role.routes.map((rr) => RouteMapper.toRouteResponse(rr.route))
        : [],
    };
  }
}
