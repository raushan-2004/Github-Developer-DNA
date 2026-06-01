import { Response } from 'express';

export const sendSuccess = (
  res: Response, 
  data: any, 
  message = 'Success', 
  statusCode = 200, 
  extra: Record<string, any> = {}
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...extra
  });
};

export const sendError = (res: Response, error: string, statusCode = 500, details: any = null) => {
  return res.status(statusCode).json({
    success: false,
    error,
    details,
  });
};
