import { UsersRepository } from "./users.repository";
import { GroupsRepository } from "./groups.repository";
import { sequelize, UserAndGroup } from "./database.initiator";


export class UsersAndGroupsRepository {
  private usersAndGroupsTable: typeof UserAndGroup;

  constructor(
    usersAndGroupsModel: typeof UserAndGroup,
    private usersRepository: UsersRepository,
    private groupsRepository: GroupsRepository) {
      this.usersAndGroupsTable = usersAndGroupsModel;
  }

  public async getAll(): Promise<UserAndGroup[]> {
    try {
      const groups: UserAndGroup[] = await this.usersAndGroupsTable.findAll();
      return groups;
    } catch(error) {
      throw error;
    }
  }

  public async addUsersToGroup(groupId: string, userIds: Array<string>): Promise<void> {
    const t = await sequelize.transaction();
    try {
      const group = await this.groupsRepository.findGroupById(groupId);
      const usersPromises = userIds.map(userId => this.usersRepository.findUserById(userId));
      Promise.all(usersPromises)
             .then(users => {
              users.forEach(async (user, index) => {
                await group.addUser(user, { transaction: t });
                await user.addGroup(group, { transaction: t });
                if (users.length === index + 1) {
                  await t.commit();
                }
              });
             });
    } catch(error) {
      await t.rollback();
      throw(error);
    }  
  }
  
}