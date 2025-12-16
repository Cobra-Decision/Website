import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserCreateDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'ایمیل وارد شده معتبر نیست' })
  @IsNotEmpty({ message: 'وارد کردن ایمیل الزامی است' })
  email: string;

  @ApiProperty({
    description: 'The password for the user account.',
    example: 'StrongPassword123',
  })
  @IsString({ message: 'رمز عبور باید رشته باشد' })
  @IsNotEmpty({ message: 'وارد کردن رمز عبور الزامی است' })
  password: string;

  @IsNumber({}, { message: 'نقش  وارد شده معتبر نیست' })
  roleId: number;
}
