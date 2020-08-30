import { Sequelize, Options, Model, DataTypes, HasManyAddAssociationMixin } from 'sequelize';
import { UserModel } from '../models/User.model';
import { GroupModel, Permission } from '../models/Group.model';
import { users } from './users';
import config from '../config';
import { UserAndGroupModel } from '../models/UserAndGroup.model';
import { errorLogger } from '../loggers/error.logger';

const DATABASE_CONFIG: Options = {
  host: config.host,
  port: config.port,
  username: config.username,
  password: config.password,
  database: config.database,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
};

export const sequelize: Sequelize = new Sequelize(DATABASE_CONFIG);

sequelize.authenticate()
         .then(() => console.log('Successfully connected to the database :)'))
         .catch((error: Error) => errorLogger.error(error));

export class User extends Model implements UserModel {
  public id!: string;
  public login!: string;
  public password!: string;
  public age!: number;
  public isDeleted!: boolean;

  public addGroup!: HasManyAddAssociationMixin<Group, string>;
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    sequelize,
  }
);

export class Group extends Model implements GroupModel {
  public id!: string;
  public name!: string;
  public permissions!: Array<Permission>;

  public addUser!: HasManyAddAssociationMixin<User, string>;
}

Group.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  },
  {
    tableName: 'groups',
    sequelize,
  }
);

export class UserAndGroup extends Model implements UserAndGroupModel {
  public userId!: string;
  public groupId!: string;
}

UserAndGroup.init(
  {
    UserId: {
      type: DataTypes.STRING,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: User,
        key: 'id',
      }
    },
    GroupId: {
      type: DataTypes.STRING,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: Group,
        key: 'id',
      }
    },
  },
  {
    tableName: 'usersgroups',
    sequelize,
  }
);

const userModelSync = User.sync({ force: true })
                          .then(() => {
                            console.log('Users table synced :)');
                            (function populateUsersTable(users) {
                              users.forEach((user: UserModel) => {
                                User.create({
                                  id: user.id,
                                  login: user.login,
                                  password: user.password,
                                  age: user.age,
                                  isDeleted: user.isDeleted,
                                })
                                .then((user: UserModel) => console.log(`${user.login} was successfully added to the users database :)`))
                                .catch((error: Error) => errorLogger.error(error));
                              })
                            })(users);
                          });

const groupModelSync = Group.sync()
                            .then(() => console.log('Groups table synced :)'));

Promise.all([userModelSync, groupModelSync]).then(() => {
  UserAndGroup.sync({ force: true })
            .then(() => {
              console.log('UsersGroup table synced :)');
              User.belongsToMany(Group, { through: UserAndGroup });
              Group.belongsToMany(User, { through: UserAndGroup });
            })
            .catch((error: Error) => errorLogger.error(error));
});
