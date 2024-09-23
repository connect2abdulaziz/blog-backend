"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../../config/sequelize"));
const post_model_1 = __importDefault(require("./post.model"));
const user_model_1 = __importDefault(require("./user.model"));
// Define the Comment model class
class Comment extends sequelize_1.Model {
}
// Initialize the Comment model
Comment.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    postId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: post_model_1.default,
            key: "id",
        },
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "user",
            key: "id",
        },
    },
    parentId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "comment",
            key: "id",
        },
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
});
// Association definitions
Comment.belongsTo(post_model_1.default, { foreignKey: "postId" });
Comment.belongsTo(user_model_1.default, { foreignKey: "userId" });
post_model_1.default.hasMany(Comment, { foreignKey: "postId" });
user_model_1.default.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(Comment, { foreignKey: "parentId" });
Comment.hasMany(Comment, { foreignKey: "parentId" });
exports.default = Comment;
//# sourceMappingURL=comment.model.js.map