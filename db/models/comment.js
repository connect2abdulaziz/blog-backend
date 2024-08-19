'use strict';
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import Post from './post.js'; 
import User from './user.js'; 

class Comment extends Model {}

Comment.init({
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
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
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
}, {
  sequelize,
  tableName: 'comment',
  freezeTableName: true,
  timestamps: true, 
  modelName: 'Comment',
  indexes: [
    {
      unique: false,
      fields: ['postId'],
      name: 'idx_comment_postId',
    },
    {
      unique: false,
      fields: ['userId'],
      name: 'idx_comment_userId',
    },
    {
      name: 'idx_comment_createdAt',
      fields: ['createdAt'],
    },
  ],
});

// Association definitions
Comment.belongsTo(Post, { foreignKey: 'postId' });
Comment.belongsTo(User, { foreignKey: 'userId' });
Post.hasMany(Comment, { foreignKey: 'postId' });
User.hasMany(Comment, { foreignKey: 'userId' });
Comment.hasMany(Comment, { foreignKey: 'parentId' });
Comment.belongsTo(Comment, { foreignKey: 'parentId'});

export default Comment;
