import { Model } from "sequelize";
import { UserAttributes, UserCreationAttributes } from "../../types/model.Interfaces";
declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    profilePicture: string | null;
    thumbnail: string | null;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export default User;
