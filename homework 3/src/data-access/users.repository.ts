import { User } from "./database.initiator";
import { UserModel } from "src/models/User.model";

export class UsersRepository {
  private usersTable: typeof User;

  constructor(userModel: typeof User) {
    this.usersTable = userModel;
  }

  async getAll(): Promise<UserModel[]> {
    const users = await this.usersTable.findAll();
    return users;
  }

  async addUser(user: UserModel): Promise<string | any> {
    try {
      const newUser = await this.usersTable.create({
        id: user.id,
        login: user.login,
        password: user.password,
        age: user.age,
        isDeleted: user.isDeleted,
      });
      return newUser.id;
    } catch(error) {
      return error;
    }
  }
}