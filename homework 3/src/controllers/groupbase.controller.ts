import { Application, Router, Request, Response } from 'express';
import { validateSchemaMiddleware } from './middlewares/validation.middleware';
import { idConsistencyMiddleware } from './middlewares/id-consistency.middleware';
import { GroupbaseService } from '../services/groupbase.service';
import { GroupModel } from '../models/Group.model';
import { joiSchemaGroup } from './middlewares/joi schemas/group-schema';

const router: Router = Router();

export const groupbaseRouter = (
    app: Application,
    groupbaseService: GroupbaseService
  ) => {
    
  app.use('/groupbase', router);

  router.get('/', async (req: Request, res: Response) => {
    try {
      const groups: GroupModel[] = await groupbaseService.getGroupbase();
      res
          .status(200)
          .json({
              message: 'Welcome to the awesome groupbase :)',
              groupbase: groups,
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
          const group: GroupModel = await groupbaseService.getGroup(req.params.id);
          res
              .status(200)
              .json(group);
        } catch(error) {
          res
              .status(400)
              .json({
                  message: `Oops there is error: ${error.message} :c`,
              });
        }
      })
      .post(validateSchemaMiddleware(joiSchemaGroup), idConsistencyMiddleware(), async (req: Request, res: Response) => {
          const newGroup: GroupModel = req.body;
          try {
            const addedGroupId: string = await groupbaseService.createGroup(newGroup);
            res
                .status(201)
                .json({
                    message: `New group with id ${addedGroupId} has been added to the groupbase :)`,
                });
          } catch(error) {
            res
                .status(400)
                .json({
                    message: `Oops there is error: ${error.message} :c`,
                });
          }
      })
      .put(validateSchemaMiddleware(joiSchemaGroup), idConsistencyMiddleware(), async (req: Request, res: Response) => {
        const groupToUpdate: GroupModel = req.body;
        try {
          const updatedGroupId: string = await groupbaseService.updateGroup(groupToUpdate);
          res
              .status(200)
              .json({
                  message: `Group with id ${updatedGroupId} was succesfully edited :)`
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
          const deletedGroupId: string = await groupbaseService.deleteGroup(req.params.id);
          res
              .status(200)
              .json({
                  message: `Group with id ${deletedGroupId} was succesfully deleted :)`
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
