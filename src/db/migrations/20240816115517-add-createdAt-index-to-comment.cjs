'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('comment', ['createdAt'], {
      name: 'idx_comment_createdAt',
      unique: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('comment', 'idx_comment_createdAt');
  }
};
