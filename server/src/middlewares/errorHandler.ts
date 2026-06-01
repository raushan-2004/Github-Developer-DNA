import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/apiResponse';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error]:', err.message);

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  return sendError(res, 'Internal Server Error', 500);
};
