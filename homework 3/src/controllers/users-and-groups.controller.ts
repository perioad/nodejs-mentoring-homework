import { Application, Router, Request, Response } from 'express';
import { UsersAndGroupsService } from '../services/users-and-groups.service';
import { UserAndGroupModel } from '../models/UserAndGroup.model';

export const router: Router = Router();

// for example: GET /user-group?groupId=${number}&userIds=${number, number, number}
// for example: GET /user-group?groupId=1&userIds=2,4

export const usersAndGroupsRouter = (
    app: Application,
    usersAndGroupsService: UsersAndGroupsService,
  ) => {
  app.use('/users-to-group', router);

  router.get('/', async (req: Request, res: Response) => {
    const groupId = req.query.groupId as string;
    const userIdsRaw = req.query.userIds as string;
    try {
      await usersAndGroupsService.addUsersToGroup(groupId, userIdsRaw);
      res
          .status(200)
          .json({
            message: `Users with ids: ${userIdsRaw} was successfully added to the group with id: ${groupId} :)`,
          });
    } catch(error) {
      res
          .status(400)
          .json({
              message: `Oops there is error: ${error.message} :c`,
          });
    }
  });

  router.get('/show', async (req: Request, res: Response) => {
    try {
      const usersGroups: UserAndGroupModel[] = await usersAndGroupsService.getUsersGroups();
      res
          .status(200)
          .json({
              message: 'Here relations between users and groups :)',
              usersGroups,
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