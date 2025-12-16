import { ApiProperty } from '@nestjs/swagger';
import { RouteResponseDto } from 'src/route/dto/route-response.dto';

export class RoleResponseDto {
  @ApiProperty({ example: 1, description: 'Role unique identifier' })
  id: number;

  @ApiProperty({
    example: 'ADMIN',
    description: 'Role name in English (identifier)',
  })
  name: string;

  @ApiProperty({ example: 'مدیر', description: 'Role title in Persian' })
  title: string;

  @ApiProperty({
    example: 'مدیر با دسترسی کامل',
    description: 'Role description in Persian',
  })
  description: string;

  @ApiProperty({
    type: [RouteResponseDto],
    description: 'List of routes accessible by this role',
    required: false,
  })
  routes?: RouteResponseDto[];

  @ApiProperty({
    description: 'Date and time when the Role was created',
    example: '2025-12-04T12:34:56.789Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the Role was last updated',
    example: '2025-12-04T12:34:56.789Z',
  })
  updatedAt: Date;
}
