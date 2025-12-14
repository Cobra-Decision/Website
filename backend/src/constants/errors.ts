import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export enum Errors {
  EMAIL_EXISTS,
  USER_NOT_FOUND,
  INVALID_CREDENTIALS,
  USER_DELETED,
  UNAUTHORIZED,

  // role & access control
  ROLE_EXISTS,
  ROLE_NOT_FOUND,
  ROUTE_NOT_FOUND,
  ROLE_ROUTE_EXISTS,
  FORBIDDEN_OPERATION,
  ROLE_HAS_USERS,

  ROUTE_EXISTS,

  UNKNOWN,
  BAD_REQUEST,
}

// Map each error to a Persian message
export const ErrorMap: Record<Errors, string> = {
  [Errors.EMAIL_EXISTS]: 'این ایمیل قبلاً ثبت شده است',
  [Errors.USER_NOT_FOUND]: 'کاربر یافت نشد',
  [Errors.INVALID_CREDENTIALS]: 'ایمیل یا رمز عبور اشتباه است',
  [Errors.USER_DELETED]: 'این کاربر حذف شده است',
  [Errors.UNAUTHORIZED]: 'دسترسی غیرمجاز',

  // role & access control
  [Errors.ROLE_EXISTS]: 'این نقش از قبل وجود دارد',
  [Errors.ROLE_NOT_FOUND]: 'نقش مورد نظر یافت نشد',
  [Errors.ROUTE_NOT_FOUND]: 'مسیر مورد نظر یافت نشد',
  [Errors.ROLE_ROUTE_EXISTS]: 'این مسیر قبلاً به نقش اختصاص داده شده است',
  [Errors.FORBIDDEN_OPERATION]: 'انجام این عملیات مجاز نیست',
  [Errors.ROLE_HAS_USERS]: 'این نقش به یک یا چند کاربر اختصاص داده شده است', // <-- Persian message

  [Errors.ROUTE_EXISTS]: 'این مسیر از قبل وجود دارد',
  [Errors.UNKNOWN]: 'خطای داخلی',
  [Errors.BAD_REQUEST]: 'درخواست نامعتبر است',
};

// Map each error to an HTTP status code
export const ErrorStatusCodeMap: Record<Errors, number> = {
  [Errors.EMAIL_EXISTS]: HttpStatus.CONFLICT,
  [Errors.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [Errors.INVALID_CREDENTIALS]: HttpStatus.UNAUTHORIZED,
  [Errors.USER_DELETED]: HttpStatus.GONE,
  [Errors.UNAUTHORIZED]: HttpStatus.FORBIDDEN,

  // role & access control
  [Errors.ROLE_EXISTS]: HttpStatus.CONFLICT,
  [Errors.ROLE_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [Errors.ROUTE_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [Errors.ROLE_ROUTE_EXISTS]: HttpStatus.CONFLICT,
  [Errors.FORBIDDEN_OPERATION]: HttpStatus.FORBIDDEN,
  [Errors.ROLE_HAS_USERS]: HttpStatus.FORBIDDEN,

  [Errors.ROUTE_EXISTS]: HttpStatus.CONFLICT,
  [Errors.BAD_REQUEST]: HttpStatus.BAD_REQUEST,
  [Errors.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
};

export class AppError {
  @ApiProperty({
    description: 'Error code, corresponds to one of the predefined errors',
    example: Errors.USER_NOT_FOUND,
  })
  code: Errors;

  @ApiProperty({
    description: 'Human-readable error message',
    example: 'User not found',
  })
  message: string;

  @ApiProperty({
    description: 'Optional debug information for internal use',
    example: 'internal error details',
    required: false,
  })
  debug?: object | string;

  @ApiProperty({
    description: 'HTTP status code associated with the error',
    example: 404,
  })
  statusCode: number;
}

// Factory function to create error objects
export function appError(code: Errors, debug?: unknown): AppError {
  let finalDebug: string | object = 'can not parse debug!';

  if (typeof debug === 'object') {
    try {
      finalDebug = debug as object;
    } catch {
      finalDebug = '[Unserializable Object]';
    }
  } else if (typeof debug === 'string') {
    finalDebug = debug;
  } else {
    console.log('can not parse debug:', debug);
  }

  logError(debug);
  return {
    code,
    message: ErrorMap[code],
    debug: finalDebug,
    statusCode: ErrorStatusCodeMap[code],
  };
}

function logError(error: unknown) {
  const timestamp = new Date().toISOString();

  let message = '';
  if (error instanceof Error) {
    message = `${error.name}: ${error.message}\n${error.stack}`;
  } else if (typeof error === 'object') {
    message = JSON.stringify(error, null, 2);
  } else {
    message = error as string;
  }

  console.error(`
==========================
[${timestamp}]
${message}
==========================
`);
}
