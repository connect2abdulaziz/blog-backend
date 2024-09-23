import { Model } from "sequelize";
import { CommentAttributes, CommentCreationAttributes } from "../../types/model.Interfaces";
declare class Comment extends Model<CommentAttributes, CommentCreationAttributes> implements CommentAttributes {
    id: number;
    content: string;
    postId: number;
    userId: number;
    parentId: number | null;
    createdAt: Date;
    updatedAt: Date;
}
export default Comment;
