'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Comment = sequelize.define(
  'comment',
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
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'post',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'comment',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    content: {
      allowNull: false,
      type: DataTypes.STRING
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
    tableName: 'comment',
    freezeTableName: true,
    timestamps: false, 
    modelName: 'comment',
  }
);


// Association definition
Comment.belongsTo(Comment, { foreignKey: 'parentId',});
Comment.hasMany(Comment, { foreignKey: 'parentId',});

module.exports = Comment;
