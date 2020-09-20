import jwt from 'jsonwebtoken';
import { UserModel } from "../models/User.model";
import { UsersRepository } from "../data-access/users.repository";
import config from "../config";

export class UserbaseService {
  private usersRepository: UsersRepository;

  constructor (usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async getUserbase(): Promise<UserModel[]> {
    try {
      const userbase: UserModel[] = await this.usersRepository.getAll();
      return userbase;
    } catch(error) {
      throw error;
    }
  }
  
  public async getUser(userId: string): Promise<UserModel> {
    try {
      const user: UserModel = await this.usersRepository.findUserById(userId);
      return user;
    } catch(error) {
      throw error;
    }
  }

  public async createUser(user: UserModel): Promise<string> {
    try {
      const newUserId: string = await this.usersRepository.addUser(user);
      return newUserId;
    } catch(error) {
      throw error;
    }
  }

  public async updateUser(user: UserModel): Promise<string> {
    try {
      const updatedUserId: string = await this.usersRepository.updateUser(user);
      return updatedUserId;
    } catch(error) {
      throw error;
    }
  }

  public async deleteUser(userId: string): Promise<string> {
    try {
      const deletedUserId: string = await this.usersRepository.deleteUser(userId);
      return deletedUserId;
    } catch(error) {
      throw error;
    }
  }

  public async authenticate(login: string, password: string): Promise<string> {
    try {
      await this.usersRepository.findUserByLoginAndPassword(login, password);
      const payload = {
        login,
      };
      const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
      return token;
    } catch(error) {
      throw error;
    }
  }
}