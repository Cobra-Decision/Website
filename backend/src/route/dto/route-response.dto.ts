import { ApiProperty } from '@nestjs/swagger';

export class RouteResponseDto {
  @ApiProperty({ example: 1, description: 'Route unique identifier' })
  id: number;

  @ApiProperty({ example: '/users', description: 'Route path' })
  path: string;

  @ApiProperty({ example: 'GET', description: 'HTTP method' })
  method: string;

  @ApiProperty({
    example: 'This route returns a list of all users',
    description: 'Description of what this route does',
  })
  description: string;

  @ApiProperty({
    description: 'Date and time when the Route was created',
    example: '2025-12-04T12:34:56.789Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the Route was last updated',
    example: '2025-12-04T12:34:56.789Z',
  })
  updatedAt: Date;
}
