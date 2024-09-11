'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('post', ['createdAt'], {
      name: 'idx_post_createdAt',
      using: 'BTREE', // Optional, can be omitted for default index type
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('post', 'idx_post_createdAt');
  },
};

