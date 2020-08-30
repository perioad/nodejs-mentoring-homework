import { UserModel } from "../models/User.model";
import { UsersRepository } from "../data-access/users.repository";
import { NotFoundError } from "../errors/not-found.error";

export class AutoSuggestService {
  private usersRepository: UsersRepository;

  constructor (usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async getSuggestion(search: string, limit: number): Promise<UserModel[] | null> {
    const users: UserModel[] = await this.usersRepository.getAll();
    const suitedUsers: UserModel[] = users.filter(
      (user: UserModel) => user.login.includes(search),
    );

    if (suitedUsers.length === 0) {
      throw new NotFoundError('there are no users from auto-suggest :c');
    } else if (suitedUsers.length > limit) {
      const limitedSuitedUsers = suitedUsers.slice(0, limit);
      return limitedSuitedUsers;
    } else {
      return suitedUsers;
    }
  }
}