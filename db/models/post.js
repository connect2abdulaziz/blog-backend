'use strict';
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database.js'; 
import Category from './category.js'; 
import Comment from './comment.js'; 

const Post = sequelize.define(
  'post',
  {
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
    categoryId:{
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
    readTime:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image:{
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumbnail:{
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  },
  {
    sequelize,
    tableName: 'post',
    freezeTableName: true,
    timestamps: true, 
    modelName: 'post',
  }
);


// Association definition
Category.hasMany(Post, {foreignKey: 'categoryId',});
Post.belongsTo(Category, { foreignKey: 'categoryId',});
Post.hasMany(Comment, {foreignKey: 'postId',});
Comment.belongsTo(Post, { foreignKey: 'postId',});

export default Post;
