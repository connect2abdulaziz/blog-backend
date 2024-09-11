import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/database";
import Category from "./category";
import User from "./user";
import { PostAttributes, PostCreationAttributes } from "./modelInterfaces";

// Define the Post model class
class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  public id!: number;
  public userId!: number;
  public categoryId!: number;
  public title!: string;
  public content!: string;
  public readTime!: number;
  public image!: string | null;
  public thumbnail!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

// Initialize the Post model
Post.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "user",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "category",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    readTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "post",
    freezeTableName: true,
    timestamps: true,
    modelName: "Post",
    indexes: [
      {
        unique: false,
        fields: ["userId"],
        name: "idx_post_userId",
      },
      {
        unique: false,
        fields: ["categoryId"],
        name: "idx_post_categoryId",
      },
      {
        unique: false,
        fields: ["title"],
        name: "idx_post_title",
      },
      {
        name: "idx_post_createdAt",
        fields: ["createdAt"],
      },
    ],
  }
);

// Association definitions
Category.hasMany(Post, { foreignKey: "categoryId" });
Post.belongsTo(Category, { foreignKey: "categoryId" });
User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

export default Post;
