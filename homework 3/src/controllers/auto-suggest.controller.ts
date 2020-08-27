import { Application, Router, Request, Response } from 'express';
import { UserModel } from '../models/User.model';
import { AutoSuggestService } from '../services/auto-suggest.service';

export const router: Router = Router();

// for example: GET /auto-suggest?limit=${number}&loginSubstring=${string}
// for example: GET /auto-suggest?limit=3&loginSubstring=ter
export const autosuggestRouter = (

  app: Application,
  autoSuggestService: AutoSuggestService) => {
  app.use('/auto-suggest', router);

  router.get('/', async (req: Request, res: Response) => {
    const search = String(req.query.loginSubstring);
    const limit = Number(req.query.limit);
    try {
      const suggestedUsers: UserModel[] | null = await autoSuggestService.getSuggestion(search, limit);
      if (suggestedUsers) {
        res
            .status(200)
            .json(suggestedUsers);
          
      } else {
        res
            .status(404)
            .json({
              message: 'There are no users from auto-suggest :c',
            });
      }
    } catch(error) {
      res
          .status(400)
          .json({
              message: `Oops there is error: ${error.message} :c`,
          });
    }
  });
}