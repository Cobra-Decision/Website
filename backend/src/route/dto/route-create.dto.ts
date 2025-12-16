import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RouteCreateDto {
  @ApiProperty({ example: '/users', description: 'Route path' })
  @IsString({ message: 'مسیر باید متن باشد' })
  @IsNotEmpty({ message: 'وارد کردن مسیر الزامی است' })
  path: string;

  @ApiProperty({ example: 'GET', description: 'HTTP method' })
  @IsString({ message: 'متد باید متن باشد' })
  @IsNotEmpty({ message: 'وارد کردن متد الزامی است' })
  method: string;

  @ApiProperty({
    example: 'این مسیر همه کاربران را برمی‌گرداند',
    description: 'Optional description of the route',
    required: false,
  })
  @IsNotEmpty({ message: 'وارد کردن توضیحات مسیر الزامی است' })
  @IsString({ message: 'توضیحات باید متن باشد' })
  description: string;
}
