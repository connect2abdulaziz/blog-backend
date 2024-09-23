"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../../config/sequelize"));
// Define the User model class
class User extends sequelize_1.Model {
}
// Initialize the User model
User.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    profilePicture: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    thumbnail: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    verified: {
        allowNull: false,
        defaultValue: false,
        type: sequelize_1.DataTypes.BOOLEAN,
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
});
exports.default = User;
//# sourceMappingURL=user.model.js.map