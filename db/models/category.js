'use strict';
const { Model, DataTypes } = require('sequelize');;

const Category = sequelize.define(
  'category',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: 'category',
    freezeTableName: true,
    timestamps: false, 
    modelName: 'category',
  }
);

module.exports = Category;