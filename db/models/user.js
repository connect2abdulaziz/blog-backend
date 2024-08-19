'use strict';
import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

class User extends Model {}

User.init({
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
    allowNull: true,
  },
  thumbnail: {
    type: DataTypes.TEXT, 
    allowNull: true,
  },
  verified: {
    allowNull: false,
    defaultValue: false,
    type: DataTypes.BOOLEAN,
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
  tableName: 'user',
  freezeTableName: true,
  timestamps: true, 
  modelName: 'User', 
  indexes: [
    {
      unique: true,
      fields: ['email'],
      name: 'idx_email_unique'
    }
  ],
});



export default User;
