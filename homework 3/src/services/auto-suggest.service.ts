import { UserModel } from "src/models/User.model";
import { UsersRepository } from "src/data-access/users.repository";

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
      return null;
    } else if (suitedUsers.length > limit) {
      const limitedSuitedUsers = suitedUsers.slice(0, limit);
      return limitedSuitedUsers;
    } else {
      return suitedUsers;
    }
  }
}