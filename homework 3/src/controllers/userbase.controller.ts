import { Application, Router, Request, Response } from 'express';
import { validateSchemaMiddleware, joiSchema } from './middlewares/validation.middleware';
import { UserbaseService } from 'src/services/userbase.service';
import { UserModel } from 'src/models/User.model';

const router: Router = Router();

export const userbaseRouter = (
  app: Application,
  userbaseService: UserbaseService) => {
    
  app.use('/userbase', router);

  router.get('/', async (req: Request, res: Response) => {
    const users: UserModel[] = await userbaseService.getUserbase();
    res
        .status(200)
        .json({
            message: 'Welcome to the awesome userbase :)',
            userbase: users,
        });
});

  router.route('/:id')
      .get(async (req: Request, res: Response) => {
          const existingUser: UserModel | null = await userbaseService.getUser(req.params.id)
          if (existingUser) {
              res
                  .status(200)
                  .json(existingUser);
          } else {
              res
                  .status(404)
                  .json({
                      message: `User with id ${req.params.id} wasn't found :c`,
                  });
          }
      })
      .post(validateSchemaMiddleware(joiSchema), async (req: Request, res: Response) => {
          const newUser: UserModel = req.body;

          if (req.params.id !== newUser.id) {
            res
                .status(400)
                .json({
                    message: `User id in the URI must be equal to the user id in the request's body (${req.params.id} !== ${newUser.id})`,
                });
            return;
          } 

          try {
            const addedUserId = await userbaseService.createUser(newUser);
            res
                .status(201)
                .json({
                    message: `New user with id ${addedUserId} has been added to the userbase`,
                });
          } catch(error) {
            res
                .status(400)
                .json({
                    message: `Oops there is error: ${error.message} :c`,
                });
          }
      })
      // .put(validateSchemaMiddleware(joiSchema), (req: Request, res: Response) => {
      //     const userToUpdate: User = req.body;
      //     const existingUser: User = app.get(USERBASE).find(
      //         (user: User) => user.id === req.params.id
      //     );
      //     if (req.params.id !== userToUpdate.id) {
      //         res
      //             .status(400)
      //             .json({
      //                 message: `User id in the URI must be equal to the user id in the request's body (${req.params.id} !== ${userToUpdate.id})`
      //             });
      //     } else if (!existingUser) {
      //         res
      //             .status(400)
      //             .json({
      //                 message: `User with id ${userToUpdate.id} doesn't exist in the userbase`
      //             });
      //     }  else if (existingUser && existingUser.isDeleted) {
      //         res
      //             .status(400)
      //             .json({
      //                 message: `User with id ${existingUser.id} has been deleted`
      //             });
      //     } else {
      //         const updatedUserbase = app.get(USERBASE).map(
      //             (user: User) => user.id === userToUpdate.id ? userToUpdate : user
      //         );
      //         app.set(USERBASE, updatedUserbase);
      //         res
      //             .status(200)
      //             .json({
      //                 message: `User with id ${userToUpdate.id} was succesfully edited`
      //             });
      //     }
      // })
      // .delete((req: Request, res: Response) => {
      //     const existingUser: User = app.get(USERBASE).find(
      //         (user: User) => user.id === req.params.id
      //     );
      //     if (!existingUser) {
      //         res
      //             .status(404)
      //             .json({
      //                 message: `User with id ${req.params.id} wasn't found :c`
      //             });
      //     } else if (existingUser && existingUser.isDeleted) {
      //         res
      //             .status(400)
      //             .json({
      //                 message: `Ooops! User with id ${existingUser.id} has already been deleted`
      //             });
      //     } else  {
      //         const updatedUserbase = app.get(USERBASE).map(
      //             (user: User) => user.id === existingUser.id ? { ...existingUser, isDeleted: true } : user
      //         );
      //         app.set(USERBASE, updatedUserbase);
      //         res
      //             .status(200)
      //             .json({
      //                 message: `User with id ${existingUser.id} was succesfully deleted`
      //             });
      //     }
      // });
}
