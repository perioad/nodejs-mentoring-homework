import { Request, Response, NextFunction } from 'express';

export const idConsistencyMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.params.id !== req.body.id) {
      res
          .status(400)
          .json({
              message: `User id in the URI must be equal to the user id in the request's body (${req.params.id} !== ${req.body.id})`,
          });
    } else {
      next();
    }
  };
};