import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { appError, Errors } from 'src/constants/errors';
import { ApiResponseDto } from 'src/shared/dto/api-response.dto';

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Parse Nest parser error message
    const error = exception.getResponse();

    response
      .status(400)
      .json(
        new ApiResponseDto(false, appError(Errors.BAD_REQUEST, error), null),
      );
  }
}
