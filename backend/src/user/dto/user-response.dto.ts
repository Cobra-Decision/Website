import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    nullable: true,
  })
  firstName: string | null;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    nullable: true,
  })
  lastName: string | null;

  @ApiProperty({
    description: 'Unique identifier of the role id',
    example: '1',
  })
  roleId: number;

  @ApiProperty({
    description: 'Date and time when the user was created',
    example: '2025-12-04T12:34:56.789Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time when the user was last updated',
    example: '2025-12-04T12:34:56.789Z',
  })
  updatedAt: Date;
}
