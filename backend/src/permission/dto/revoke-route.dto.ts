import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class RevokeRouteDto {
  @ApiProperty({ description: 'ID of the role' })
  @Type(() => Number)
  @IsInt({ message: 'شناسه نقش باید یک عدد صحیح باشد' })
  @Min(1, { message: 'شناسه نقش باید بزرگ‌تر از صفر باشد' })
  roleId: number;

  @ApiProperty({ description: 'ID of the route to revoke' })
  @Type(() => Number)
  @IsInt({ message: 'شناسه مسیر باید یک عدد صحیح باشد' })
  @Min(1, { message: 'شناسه مسیر باید بزرگ‌تر از صفر باشد' })
  routeId: number;
}
