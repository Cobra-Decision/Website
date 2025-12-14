import { ApiProperty } from '@nestjs/swagger';
import { AppError } from 'src/constants/errors';
import { AppResult } from './app-result.dto';

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

  static fromAppResult<T>(result: AppResult<T>): ApiResponseDto<T> {
    return {
      success: result.success,
      data: result.success ? result.data : (null as T),
      error: result.success ? null : result.error,
    };
  }
}
