import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RouteUpdateDto {
  @ApiProperty({
    example: '/users',
    description: 'Route path',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'مسیر باید متن باشد' })
  path?: string;

  @ApiProperty({ example: 'GET', description: 'HTTP method', required: false })
  @IsOptional()
  @IsString({ message: 'متد باید متن باشد' })
  method?: string;

  @ApiProperty({
    example: 'این مسیر همه کاربران را برمی‌گرداند',
    description: 'Optional description of the route',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'توضیحات باید متن باشد' })
  description?: string;
}
