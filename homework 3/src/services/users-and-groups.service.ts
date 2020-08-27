import { UsersAndGroupsRepository } from "../data-access/users-and-groups.repository";
import { UserAndGroupModel } from "../models/UserAndGroup.model";

export class UsersAndGroupsService {
  private usersAndGroupsRepository: UsersAndGroupsRepository;

  constructor (usersAndGroupsRepository: UsersAndGroupsRepository) {
    this.usersAndGroupsRepository = usersAndGroupsRepository;
  }

  public async getUsersGroups(): Promise<UserAndGroupModel[]> {
    try {
      const usersAndGroups: UserAndGroupModel[] = await this.usersAndGroupsRepository.getAll();
      return usersAndGroups;
    } catch(error) {
      throw error;
    }
  }

  public async addUsersToGroup(groupId: string, userIdsRaw: string): Promise<void> {
    const userIds = userIdsRaw.split(',');
    try {
      await this.usersAndGroupsRepository.addUsersToGroup(groupId, userIds);
    } catch (error) {
      throw(error);
    }
  }
}