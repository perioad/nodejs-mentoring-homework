import { UserModel } from "src/models/User.model";
import { UsersRepository } from "src/data-access/users.repository";

export class UserbaseService {
  private usersRepository: UsersRepository;

  constructor (usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async getUserbase(): Promise<UserModel[]> {
    const userbase = await this.usersRepository.getAll();
    return userbase;
  }
  
  public async getUser(userId: string): Promise<UserModel | null> {
    const userbase = await this.getUserbase();
    const existingUser: UserModel | undefined = userbase.find(
      (user: UserModel) => user.id === userId,
    );
    return existingUser ? existingUser : null;
  }

  public async createUser(user: UserModel): Promise<string | Error> {
    const dbResponce = await this.usersRepository.addUser(user);
    if (typeof dbResponce === 'string') {
      return dbResponce;
    } else {
      throw new Error(dbResponce.original.detail);
    }
  }

  public async deleteUser(userId: string) {
    const userbase = await this.getUserbase();
    const existingUser: UserModel | undefined = userbase.map(
      (user: UserModel) => user.id === existingUser.id ? { ...existingUser, isDeleted: true } : user
      );
    return 
  }
}