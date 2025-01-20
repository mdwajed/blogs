import { Request, Response } from 'express';

export class AppError extends Error {
  status: number;
  success: boolean;
  errors: unknown;

  constructor(message: string, status: number, errors?: unknown) {
    super(message);
    this.status = status;
    this.success = false;
    this.errors = errors || null;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
): void => {
  const statusCode = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  // Log detailed errors in non-production environments
  if (!isProduction) {
    console.error(`Error on ${req.method} ${req.url}:`, err);
  }

  // Send error response
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    success: false,
    error: isProduction ? undefined : err.errors || err.name || 'Error',
    stack: isProduction ? undefined : err.stack,
  });
};
