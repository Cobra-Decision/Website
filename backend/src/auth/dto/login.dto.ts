import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'ایمیل وارد شده معتبر نیست' })
  @IsNotEmpty({ message: 'وارد کردن ایمیل الزامی است' })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'StrongPassword123',
  })
  @IsString({ message: 'رمز عبور باید رشته باشد' })
  @IsNotEmpty({ message: 'وارد کردن رمز عبور الزامی است' })
  password: string;
}
