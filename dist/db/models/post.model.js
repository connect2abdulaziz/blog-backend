"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../../config/sequelize"));
const category_model_1 = __importDefault(require("./category.model"));
const user_model_1 = __importDefault(require("./user.model"));
// Define the Post model class
class Post extends sequelize_1.Model {
}
// Initialize the Post model
Post.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: "user",
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    categoryId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "category",
            key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    readTime: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    image: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    thumbnail: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    createdAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: sequelize_2.default,
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
});
// Association definitions
category_model_1.default.hasMany(Post, { foreignKey: "categoryId" });
Post.belongsTo(category_model_1.default, { foreignKey: "categoryId" });
user_model_1.default.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(user_model_1.default, { foreignKey: "userId" });
exports.default = Post;
//# sourceMappingURL=post.model.js.map