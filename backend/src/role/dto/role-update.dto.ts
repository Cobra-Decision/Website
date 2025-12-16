import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RoleUpdateDto {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Role name in English (identifier)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'نام نقش باید متن باشد' })
  name?: string;

  @ApiProperty({
    example: 'مدیر',
    description: 'Role title in Persian',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'عنوان نقش باید متن باشد' })
  title?: string;

  @ApiProperty({
    example: 'مدیر با دسترسی کامل',
    description: 'Role description in Persian',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'توضیحات نقش باید متن باشد' })
  description?: string;
}
