import { Model, DataTypes } from "sequelize";
import sequelize from "../../config/sequelize";
import Post from "./post.model";
import User from "./user.model";
import {
  CommentAttributes,
  CommentCreationAttributes,
} from "../../types/model.Interfaces";

// Define the Comment model class
class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  public id!: number;
  public content!: string;
  public postId!: number;
  public userId!: number;
  public parentId!: number | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

// Initialize the Comment model
Comment.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "comment", 
        key: "id",
      },
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
    tableName: "comment",
    freezeTableName: true,
    timestamps: true,
    modelName: "Comment",
    indexes: [
      {
        unique: false,
        fields: ["postId"],
        name: "idx_comment_postId",
      },
      {
        unique: false,
        fields: ["userId"],
        name: "idx_comment_userId",
      },
      {
        name: "idx_comment_createdAt",
        fields: ["createdAt"],
      },
    ],
  }
);

// Association definitions
Comment.belongsTo(Post, { foreignKey: "postId" });
Comment.belongsTo(User, { foreignKey: "userId" });
Post.hasMany(Comment, { foreignKey: "postId" });
User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(Comment, { foreignKey: "parentId" });
Comment.hasMany(Comment, { foreignKey: "parentId" });

export default Comment;
