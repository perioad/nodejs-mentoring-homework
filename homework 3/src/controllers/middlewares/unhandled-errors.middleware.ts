import { Request, Response, NextFunction } from 'express';
import { errorLogger } from '../../loggers/error.logger';


export const unhandledErrorsMiddleware = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  errorLogger.error(error);
  res.status(500)
     .json({
       message: 'internal server error :c',
     });
};