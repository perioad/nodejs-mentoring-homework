import { Request, Response, NextFunction } from 'express';
import { errorLogger } from '../../loggers/error.logger';


export const unhandledErrorsMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  errorLogger.error(err);
  res.status(500)
     .json({
       message: 'internal server error :c',
     });
};