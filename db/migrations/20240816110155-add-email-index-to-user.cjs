'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('user', ['email'], {
      unique: true,
      name: 'users_email_unique_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('user', 'users_email_unique_index');
  }
};
