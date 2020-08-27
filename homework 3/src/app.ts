import express, { Application } from 'express';

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

const app: Application = express();

app.listen(3000);

app.use(express.json());

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
