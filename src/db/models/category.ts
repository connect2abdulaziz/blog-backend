import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/database";
import {
  CategoryAttributes,
  CategoryCreationAttributes,
} from "./modelInterfaces";

// Define the Category model class
class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public tag!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

// Initialize the Category model
Category.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "category",
    freezeTableName: true,
    timestamps: true,
    modelName: "Category",
  }
);

export default Category;
