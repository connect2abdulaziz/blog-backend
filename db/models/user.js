'use strict';
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import Post from './post.js'; 
import Comment from './comment.js'; 


const User = sequelize.define(
  'user',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePicture: {
      type: DataTypes.TEXT, 
      allowNull: true
    },
    thumbnail: {
      type: DataTypes.TEXT, 
      allowNull: true
    },
    verified: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: 'user',
    freezeTableName: true,
    timestamps: true, 
    modelName: 'user',
  }
);
// association definition
User.hasMany(Post, { foreignKey: 'userId' });
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

export default User;
