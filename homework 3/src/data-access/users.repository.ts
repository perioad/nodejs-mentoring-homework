import { User } from "./database.initiator";
import { UserModel } from "../models/User.model";
import { WhereOptions } from "sequelize/types";
import { AlreadyDeletedError } from "../errors/already-deleted.error";
import { NotFoundError } from "../errors/not-found.error";

export class UsersRepository {
  private usersTable: typeof User;

  constructor(userModel: typeof User) {
    this.usersTable = userModel;
  }

  public async getAll(): Promise<UserModel[]> {
    try {
      const users: User[] = await this.usersTable.findAll();
      return users;
    } catch(error) {
      throw error;
    }
  }

  public async addUser(user: UserModel): Promise<string> {
    try {
      const newUser: User = await this.usersTable.create({
        id: user.id,
        login: user.login,
        password: user.password,
        age: user.age,
        isDeleted: user.isDeleted,
      });
      return newUser.id;
    } catch(error) {
      throw error;
    }
  }

  public async updateUser(user: UserModel): Promise<string> {
    try {
      const userToUpdate: User = await this.findUserById(user.id);
      Object.entries((user)).forEach(entry => {
        const [key, value] = entry as [keyof UserModel, never];
        userToUpdate[key] = value;
      });
      userToUpdate.save();
      return userToUpdate.id;
    } catch(error) {
      throw error;
    }
  }

  public async deleteUser(userId: string): Promise<string> {
    try {
      const userToDelete: User = await this.findUserById(userId);
      if (userToDelete && userToDelete.isDeleted) {
        throw new AlreadyDeletedError(`user with id ${userId} has already been deleted :c`);
      }
      userToDelete.isDeleted = true;
      await userToDelete.save();
      return userToDelete.id;
    } catch(error) {
      throw error;
    }
  }

  public async findUserById(id: string): Promise<User> {
    try {
      const user: User | null = await this.usersTable.findOne({
        where: {
          id,
        } as WhereOptions,
      });
      if (user !== null) {
        return user;
      } else {
        throw new NotFoundError(`user with id ${id} wasn't found :c`);
      }
    } catch(error) {
      throw error;
    }
  }

  public async findUserByLoginAndPassword(login: string, password: string): Promise<User> {
    try {
      const user: User | null = await this.usersTable.findOne({
        where: {
          login,
          password,
        } as WhereOptions,
      });
      if (user !== null) {
        return user;
      } else {
        throw new NotFoundError(`user with login ${login} and password ${password} wasn't found :c`);
      }
    } catch(error) {
      throw error;
    }
  }
  
}