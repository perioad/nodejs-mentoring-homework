import { Request, Response, NextFunction } from 'express';
import { requestLogger } from '../../loggers/request.logger';
import { parseRequestArguments } from '../utilities/parse-request-arguments';

export const requestInfoMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const parsedArguments: string | boolean = parseRequestArguments(req.body, req.query);

  requestLogger.info(`'${req.method}' method has been invoked with ${parsedArguments ? parsedArguments : 'no arguments' } :)`);
  next();
};