'use strict';
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database.js'; 
import Category from './category.js'; 
import User from './user.js';

class Post extends Model {}

Post.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'category',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    readTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW 
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW 
    }
  },
  {
    sequelize,
    tableName: 'post',
    freezeTableName: true,
    timestamps: true, 
    modelName: 'Post',
    indexes: [
      {
        unique: false,
        fields: ['userId'],
        name: 'idx_post_userId'
      },
      {
        unique: false,
        fields: ['categoryId'],
        name: 'idx_post_categoryId'
      },
      {
        unique: false,
        fields: ['title'],
        name: 'idx_post_title'
      },
      {
        name: 'idx_post_createdAt',
        fields: ['createdAt'],
      },
    ]
  }
);

// Association definition
Category.hasMany(Post, { foreignKey: 'categoryId' });
Post.belongsTo(Category, { foreignKey: 'categoryId' });
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

export default Post;
