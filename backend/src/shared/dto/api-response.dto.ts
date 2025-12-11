import { ApiProperty } from '@nestjs/swagger';
import { AppError } from 'src/constants/errors';

export class ApiResponseDto<T> {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  success: boolean;

  @ApiProperty({
    description: 'Error object if the request failed, otherwise null',
    nullable: true,
    type: () => AppError,
  })
  error: AppError | null;

  @ApiProperty({
    description: 'Response data of the request',
    type: Object,
  })
  data: T;

  constructor(success: boolean, data: T, error: AppError | null = null) {
    this.success = success;
    this.data = data;
    this.error = error;
  }
}
