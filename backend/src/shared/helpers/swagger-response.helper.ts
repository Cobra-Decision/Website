import { getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/shared/dto/api-response.dto';
import { AppError } from 'src/constants/errors';

export function ApiResponseSchema<T>(model: new () => T) {
  return {
    allOf: [
      { $ref: getSchemaPath(ApiResponseDto) },
      {
        properties: {
          data: { $ref: getSchemaPath(model) },
          error: { $ref: getSchemaPath(AppError) },
        },
      },
    ],
  };
}
