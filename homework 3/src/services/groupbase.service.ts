import { GroupModel } from "../models/Group.model";
import { GroupsRepository } from "../data-access/groups.repository";

export class GroupbaseService {
  private groupsRepository: GroupsRepository;

  constructor (groupsRepository: GroupsRepository) {
    this.groupsRepository = groupsRepository;
  }

  public async getGroupbase(): Promise<GroupModel[]> {
    try {
      const groupbase: GroupModel[] = await this.groupsRepository.getAll();
      return groupbase;
    } catch(error) {
      throw error;
    }
  }
  
  public async getGroup(groupId: string): Promise<GroupModel> {
    try {
      const group: GroupModel = await this.groupsRepository.findGroupById(groupId);
      return group;
    } catch(error) {
      throw error;
    }
  }

  public async createGroup(group: GroupModel): Promise<string> {
    try {
      const newGroupId: string = await this.groupsRepository.addGroup(group);
      return newGroupId;
    } catch(error) {
      throw error;
    }
  }

  public async updateGroup(group: GroupModel): Promise<string> {
    try {
      const updatedGroupId: string = await this.groupsRepository.updateGroup(group);
      return updatedGroupId;
    } catch(error) {
      throw error;
    }
  }

  public async deleteGroup(groupId: string): Promise<string> {
    try {
      const deletedGroupId: string = await this.groupsRepository.deleteGroup(groupId);
      return deletedGroupId;
    } catch(error) {
      throw error;
    }
  }
}