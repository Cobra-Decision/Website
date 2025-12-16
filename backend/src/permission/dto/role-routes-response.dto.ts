// dto/role-routes-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { RouteResponseDto } from 'src/route/dto/route-response.dto';

export class RoleRoutesResponseDto {
  @ApiProperty({ description: 'ID of the role' })
  roleId: number;

  @ApiProperty({ description: 'Title of the role' })
  title: string;

  @ApiProperty({
    description: 'Routes assigned to the role',
    type: [RouteResponseDto],
  })
  routes: RouteResponseDto[];
}
