import express, { Application } from 'express';

import { userbaseRouter } from './controllers/userbase.controller';
import { autosuggestRouter } from './controllers/auto-suggest.controller';
import { UsersRepository } from './data-access/users.repository';
import { User } from './data-access/database.initiator';
import { AutoSuggestService } from './services/auto-suggest.service';
import { UserbaseService } from './services/userbase.service';

const app: Application = express();

app.listen(3000);

app.use(express.json());

const usersRepository = new UsersRepository(User);
const userbaseService = new UserbaseService(usersRepository);
const autoSuggestService = new AutoSuggestService(usersRepository);

userbaseRouter(app, userbaseService);

autosuggestRouter(app, autoSuggestService);
