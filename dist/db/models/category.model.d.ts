import { Model } from "sequelize";
import { CategoryAttributes, CategoryCreationAttributes } from "../../types/model.Interfaces";
declare class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
    id: number;
    tag: string;
    createdAt: Date;
    updatedAt: Date;
}
export default Category;
