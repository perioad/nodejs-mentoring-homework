import express, { Application } from 'express';
import cors from 'cors';

import { userbaseRouter } from './controllers/userbase.controller';
import { autosuggestRouter } from './controllers/auto-suggest.controller';
import { UsersRepository } from './data-access/users.repository';
import { User, Group, UserAndGroup } from './data-access/database.initiator';
import { AutoSuggestService } from './services/auto-suggest.service';
import { UserbaseService } from './services/userbase.service';
import { GroupsRepository } from './data-access/groups.repository';
import { GroupbaseService } from './services/groupbase.service';
import { groupbaseRouter } from './controllers/groupbase.controller';
import { usersAndGroupsRouter } from './controllers/users-and-groups.controller';
import { UsersAndGroupsService } from './services/users-and-groups.service';
import { UsersAndGroupsRepository } from './data-access/users-and-groups.repository';
import { requestInfoMiddleware } from './controllers/middlewares/request-info.middleware';
import { unhandledErrorsMiddleware } from './controllers/middlewares/unhandled-errors.middleware';
import { errorsHandlerMiddleware } from './controllers/middlewares/errors-handler.middleware';
import { errorLogger } from './loggers/error.logger';
import { checkTokenMiddleware } from './controllers/middlewares/checkToken.middleware';

const app: Application = express();

app.listen(3000);

app.use(express.json());
app.use(cors());
app.use(requestInfoMiddleware);
app.use(checkTokenMiddleware);

const usersRepository = new UsersRepository(User);
const userbaseService = new UserbaseService(usersRepository);
const autoSuggestService = new AutoSuggestService(usersRepository);

const groupsRepository = new GroupsRepository(Group);
const groupbaseService = new GroupbaseService(groupsRepository);

const usersToGroupRepository = new UsersAndGroupsRepository(UserAndGroup, usersRepository, groupsRepository);
const usersToGroupService = new UsersAndGroupsService(usersToGroupRepository);

userbaseRouter(app, userbaseService);

autosuggestRouter(app, autoSuggestService);

groupbaseRouter(app, groupbaseService);

usersAndGroupsRouter(app, usersToGroupService);

app.use(errorsHandlerMiddleware);

app.use(unhandledErrorsMiddleware);

process
  .on('unhandledRejection', (error: Error) => {
    errorLogger.error(error);
  })
  .on('uncaughtException', (error: Error) => {
    errorLogger.error(error);
  });
