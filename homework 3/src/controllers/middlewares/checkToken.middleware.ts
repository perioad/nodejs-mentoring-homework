import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../../errors/unauthorized.error';
import { ForbiddenError } from '../../errors/forbidden.error';
import config from '../../config';

export const checkTokenMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.url === '/userbase/login' && req.method === 'GET') {
    next();
    return;
  }

  const token = req.headers['x-access-token'] as string;

  if (token) {
    jwt.verify(token, config.jwtSecret, (error) => {
      if (error) {
        const forbiddenError = new ForbiddenError('The token is not valid :c');
        next(forbiddenError);
      } else {
        next();
      }
    })
  } else {
    const unauthorizedError = new UnauthorizedError('You must provide authorization token :c');
    next(unauthorizedError);
  }
};