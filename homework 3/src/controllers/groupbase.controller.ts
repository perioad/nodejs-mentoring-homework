import { Application, Router, Request, Response } from 'express';
import { validateSchemaMiddleware } from './middlewares/validation.middleware';
import { idConsistencyMiddleware } from './middlewares/id-consistency.middleware';
import { GroupbaseService } from '../services/groupbase.service';
import { GroupModel } from '../models/Group.model';
import { joiSchemaGroup } from './middlewares/joi schemas/group-schema';
import { wrapAsync } from './utilities/wrap-async';

const router: Router = Router();

export const groupbaseRouter = (
    app: Application,
    groupbaseService: GroupbaseService
  ) => {
    
  app.use('/groupbase', router);

  router.get('/', wrapAsync(async (req: Request, res: Response) => {
    const groups: GroupModel[] = await groupbaseService.getGroupbase();
    res
        .status(200)
        .json({
            message: 'Welcome to the awesome groupbase :)',
            groupbase: groups,
        });
  }));

  router.route('/:id')
      .get(wrapAsync(async (req: Request, res: Response) => {
        const group: GroupModel = await groupbaseService.getGroup(req.params.id);
        res
            .status(200)
            .json(group);
      }))
      .post(validateSchemaMiddleware(joiSchemaGroup), idConsistencyMiddleware(), wrapAsync(async (req: Request, res: Response) => {
        const newGroup: GroupModel = req.body;
        const addedGroupId: string = await groupbaseService.createGroup(newGroup);
        res
            .status(201)
            .json({
                message: `New group with id ${addedGroupId} has been added to the groupbase :)`,
            });
      }))
      .put(validateSchemaMiddleware(joiSchemaGroup), idConsistencyMiddleware(), wrapAsync(async (req: Request, res: Response) => {
        const groupToUpdate: GroupModel = req.body;
        const updatedGroupId: string = await groupbaseService.updateGroup(groupToUpdate);
        res
            .status(200)
            .json({
                message: `Group with id ${updatedGroupId} was succesfully edited :)`
            });
      }))
      .delete(wrapAsync(async (req: Request, res: Response) => {
        const deletedGroupId: string = await groupbaseService.deleteGroup(req.params.id);
        res
            .status(200)
            .json({
                message: `Group with id ${deletedGroupId} was succesfully deleted :)`
            });
      }));
}
