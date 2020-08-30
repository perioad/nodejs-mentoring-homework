import { Application, Router, Request, Response } from 'express';
import { validateSchemaMiddleware } from './middlewares/validation.middleware';
import { idConsistencyMiddleware } from './middlewares/id-consistency.middleware';
import { UserbaseService } from '../services/userbase.service';
import { UserModel } from '../models/User.model';
import { joiSchemaUser } from './middlewares/joi schemas/user-schema';
import { wrapAsync } from './utilities/wrap-async';

const router: Router = Router();

export const userbaseRouter = (
    app: Application,
    userbaseService: UserbaseService
  ) => {
    
  app.use('/userbase', router);

  router.get('/', wrapAsync(async (req: Request, res: Response) => {
    const users: UserModel[] = await userbaseService.getUserbase();
    res
        .status(200)
        .json({
            message: 'Welcome to the awesome userbase :)',
            userbase: users,
        });
  }));

  router.route('/:id')
      .get(wrapAsync(async (req: Request, res: Response) => {
        const user: UserModel = await userbaseService.getUser(req.params.id);
        res
            .status(200)
            .json(user);
      }))
      .post(validateSchemaMiddleware(joiSchemaUser), idConsistencyMiddleware(), wrapAsync(async (req: Request, res: Response) => {
        const newUser: UserModel = req.body;
        const addedUserId: string = await userbaseService.createUser(newUser);
        res
            .status(201)
            .json({
                message: `New user with id ${addedUserId} has been added to the userbase :)`,
            });
      }))
      .put(validateSchemaMiddleware(joiSchemaUser), idConsistencyMiddleware(), wrapAsync(async (req: Request, res: Response) => {
        const userToUpdate: UserModel = req.body;
        const updatedUserId: string = await userbaseService.updateUser(userToUpdate);
        res
            .status(200)
            .json({
                message: `User with id ${updatedUserId} was succesfully edited :)`
            });
      }))
      .delete(wrapAsync(async (req: Request, res: Response) => {
        const deletedUserId: string = await userbaseService.deleteUser(req.params.id);
        res
            .status(200)
            .json({
                message: `User with id ${deletedUserId} was succesfully deleted :)`
            });
      }));
}
