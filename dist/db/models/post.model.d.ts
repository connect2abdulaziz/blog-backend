import { Model } from "sequelize";
import { PostAttributes, PostCreationAttributes } from "../../types/model.Interfaces";
declare class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
    id: number;
    userId: number;
    categoryId: number;
    title: string;
    content: string;
    readTime: number;
    image: string | null;
    thumbnail: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export default Post;
