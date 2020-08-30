import { Application, Router, Request, Response } from 'express';
import { UserModel } from '../models/User.model';
import { AutoSuggestService } from '../services/auto-suggest.service';
import { wrapAsync } from './utilities/wrap-async';

export const router: Router = Router();

// for example: GET /auto-suggest?limit=${number}&loginSubstring=${string}
// for example: GET /auto-suggest?limit=3&loginSubstring=ter
export const autosuggestRouter = (
  app: Application,
  autoSuggestService: AutoSuggestService) => {
  app.use('/auto-suggest', router);

  router.get('/', wrapAsync(async (req: Request, res: Response) => {
    const search = String(req.query.loginSubstring);
    const limit = Number(req.query.limit);
    const suggestedUsers: UserModel[] | null = await autoSuggestService.getSuggestion(search, limit);
    res
        .status(200)
        .json(suggestedUsers);
  }));
}