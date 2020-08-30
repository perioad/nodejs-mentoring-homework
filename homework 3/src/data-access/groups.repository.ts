import { WhereOptions } from "sequelize/types";
import { Group } from "./database.initiator";
import { GroupModel } from "../models/Group.model";
import { NotFoundError } from "../errors/not-found.error";

export class GroupsRepository {
  private groupsTable: typeof Group;

  constructor(groupModel: typeof Group) {
    this.groupsTable = groupModel;
  }

  public async getAll(): Promise<GroupModel[]> {
    try {
      const groups: Group[] = await this.groupsTable.findAll();
      return groups;
    } catch(error) {
      throw error;
    }
  }

  public async addGroup(group: GroupModel): Promise<string> {
    try {
      const newGroup: Group = await this.groupsTable.create({
        id: group.id,
        name: group.name,
        permissions: group.permissions,
      });
      return newGroup.id;
    } catch(error) {
      throw error;
    }
  }

  public async updateGroup(group: GroupModel): Promise<string> {
    try {
      const groupToUpdate: Group = await this.findGroupById(group.id);
      Object.entries((group)).forEach(entry => {
        const [key, value] = entry as [keyof GroupModel, never];
        groupToUpdate[key] = value;
      });
      groupToUpdate.save();
      return groupToUpdate.id;
    } catch(error) {
      throw error;
    }
  }

  public async deleteGroup(groupId: string): Promise<string> {
    try {
      const groupToDelete: Group = await this.findGroupById(groupId);
      await groupToDelete.destroy();
      return groupToDelete.id;
    } catch(error) {
      throw error;
    }
  }

  public async findGroupById(id: string): Promise<Group> {
    try {
      const group: Group | null = await this.groupsTable.findOne({
        where: {
          id,
        } as WhereOptions,
      });
      if (group !== null) {
        return group;
      } else {
        throw new NotFoundError(`group with id ${id} wasn't found :c`);
      }
    } catch(error) {
      throw error;
    }
  }
  
}