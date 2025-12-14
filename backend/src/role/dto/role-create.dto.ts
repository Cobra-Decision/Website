import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RoleCreateDto {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Role name in English (identifier)',
  })
  @IsString({ message: 'نام نقش باید متن باشد' })
  @IsNotEmpty({ message: 'وارد کردن نام نقش الزامی است' })
  name: string;

  @ApiProperty({
    example: 'مدیر',
    description: 'Role title in Persian',
  })
  @IsString({ message: 'عنوان نقش باید متن باشد' })
  @IsNotEmpty({ message: 'وارد کردن عنوان نقش الزامی است' })
  title: string;

  @ApiProperty({
    example: 'مدیر با دسترسی کامل',
    description: 'Role description in Persian',
  })
  @IsString({ message: 'توضیحات نقش باید متن باشد' })
  @IsNotEmpty({ message: 'وارد کردن توضیحات نقش الزامی است' })
  description: string;
}
