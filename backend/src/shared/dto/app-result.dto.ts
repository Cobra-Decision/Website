import { AppError } from 'src/constants/errors';

export type AppResult<T> =
  | { success: true; data: T }
  | { success: false; error: AppError };
