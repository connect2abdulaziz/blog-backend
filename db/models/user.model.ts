import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";
import {
  UserAttributes,
  UserCreationAttributes,
} from "../../types/model.Interfaces";

// Define the User model class
class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public profilePicture!: string | null;
  public thumbnail!: string | null;
  public verified!: boolean;
  public createdAt!: Date;
  public updatedAt!: Date;
}

// Initialize the User model
User.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePicture: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    verified: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "user",
    freezeTableName: true,
    timestamps: true,
    modelName: "User",
    indexes: [
      {
        unique: true,
        fields: ["email"],
        name: "idx_email_unique",
      },
    ],
  }
);

export default User;
