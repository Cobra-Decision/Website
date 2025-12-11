import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { appError, Errors } from 'src/constants/errors';
import { UserResponseDto } from 'src/user/dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      this.throwApiError('Token not found');
    }

    try {
      const payload: UserResponseDto = await this.jwtService.verifyAsync(
        token,
        { secret: process.env.JWT_SECRET },
      );

      request['user'] = payload;
      return true;
    } catch {
      this.throwApiError('Invalid or expired token');
    }
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.token as string;
  }

  private throwApiError(message: string): never {
    throw new HttpException(
      {
        success: false,
        error: appError(Errors.UNAUTHORIZED, message),
      },
      401,
    );
  }
}
