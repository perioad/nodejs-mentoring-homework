import { Application, Router, Request, Response } from 'express';
import { validateSchemaMiddleware, joiSchema } from './middlewares/validation.middleware';
import { idConsistencyMiddleware } from './middlewares/id-consistency.middleware';
import { UserbaseService } from 'src/services/userbase.service';
import { UserModel } from 'src/models/User.model';

const router: Router = Router();

export const userbaseRouter = (
  app: Application,
  userbaseService: UserbaseService) => {
    
  app.use('/userbase', router);

  router.get('/', async (req: Request, res: Response) => {
    try {
      const users: UserModel[] = await userbaseService.getUserbase();
      res
          .status(200)
          .json({
              message: 'Welcome to the awesome userbase :)',
              userbase: users,
          });
    } catch(error) {
      res
          .status(400)
          .json({
              message: `Oops there is error: ${error.message} :c`,
          });
    }
});

  router.route('/:id')
      .get(async (req: Request, res: Response) => {
        try {
          const user: UserModel = await userbaseService.getUser(req.params.id);
          res
              .status(200)
              .json(user);
        } catch(error) {
          res
              .status(400)
              .json({
                  message: `Oops there is error: ${error.message} :c`,
              });
        }
      })
      .post(validateSchemaMiddleware(joiSchema), idConsistencyMiddleware(), async (req: Request, res: Response) => {
          const newUser: UserModel = req.body;
          try {
            const addedUserId = await userbaseService.createUser(newUser);
            res
                .status(201)
                .json({
                    message: `New user with id ${addedUserId} has been added to the userbase :)`,
                });
          } catch(error) {
            res
                .status(400)
                .json({
                    message: `Oops there is error: ${error.message} :c`,
                });
          }
      })
      .put(validateSchemaMiddleware(joiSchema), idConsistencyMiddleware(), async (req: Request, res: Response) => {
        const userToUpdate: UserModel = req.body;
        try {
          const updatedUserId: string = await userbaseService.updateUser(userToUpdate);
          res
              .status(200)
              .json({
                  message: `User with id ${updatedUserId} was succesfully edited :)`
              });
        } catch(error) {
          res
              .status(400)
              .json({
                  message: `Oops there is error: ${error.message} :c`,
              });
        }
      })
      .delete(async (req: Request, res: Response) => {
        try {
          const deletedUserId = await userbaseService.deleteUser(req.params.id);
          res
              .status(200)
              .json({
                  message: `User with id ${deletedUserId} was succesfully deleted :)`
              });
        } catch(error) {
          res
              .status(400)
              .json({
                  message: `Oops there is error: ${error.message} :c`,
              });
        }
      });
}
