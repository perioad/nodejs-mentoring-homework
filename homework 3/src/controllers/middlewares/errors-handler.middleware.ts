import { Request, Response, NextFunction } from 'express';
import { BaseError } from 'sequelize';
import { NotFoundError } from '../../errors/not-found.error';
import { AlreadyDeletedError } from '../../errors/already-deleted.error';
import { errorLogger } from '../../loggers/error.logger';
import { parseRequestArguments } from '../utilities/parse-request-arguments';
import { UnauthorizedError } from '../../errors/unauthorized.error';
import { ForbiddenError } from '../../errors/forbidden.error';

export const errorsHandlerMiddleware = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  const parsedArguments: string | boolean = parseRequestArguments(req.body, req.query);

  if (error instanceof NotFoundError) {
    errorLogger.error(error.message, { requestMethod: req.method, parsedArguments });

     res.status(404)
              .json({
                type: 'NotFoundError',
                message: error.message,
              });
  } else if (error instanceof UnauthorizedError) {
    errorLogger.error(error.message, { requestMethod: req.method, parsedArguments });

    res.status(401)
             .json({
               type: 'UnauthorizedError',
               message: error.message,
             });
  } else if (error instanceof ForbiddenError) {
    errorLogger.error(error.message, { requestMethod: req.method, parsedArguments });

    res.status(403)
            .json({
              type: 'ForbiddenError',
              message: error.message,
            });
  } else if (error instanceof AlreadyDeletedError) {
    errorLogger.error(error.message, { requestMethod: req.method, parsedArguments });

    res.status(500)
             .json({
               type: 'AlreadyDeletedError',
               message: error.message,
             });
  } else if (error instanceof BaseError) {
    errorLogger.error(error.message, { requestMethod: req.method, parsedArguments });

    res.status(503)
            .json({
              type: 'BaseError',
              message: error.message,
            });
  } else {
    next(error);
  }
};