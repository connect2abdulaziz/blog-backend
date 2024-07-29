'use strict';

const { QueryInterface } = require("sequelize");
const bcrypt = require('bcrypt');

module.exports = {
  up: (QueryInterface, Sequelize) => {
    let password = process.env.ADMIN_PASSWORD;
    const hashPassword = bcrypt.hashSync(password, 10);
    return QueryInterface.bulkInsert('user', [{
      userType: '0',
      firstName: 'John',
      lastName: 'Doe',
      email: process.env.ADMIN_EMAIL,
      password: hashPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (QueryInterface, Sequelize) => {
    return QueryInterface.bulkDelete('user', {userType: '0'}, {});
  }
}
