'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('post', ['userId'], {
      name: 'idx_post_userId',
      unique: false
    });

    await queryInterface.addIndex('post', ['categoryId'], {
      name: 'idx_post_categoryId',
      unique: false
    });

    await queryInterface.addIndex('post', ['title'], {
      name: 'idx_post_title',
      unique: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('post', 'idx_post_userId');
    await queryInterface.removeIndex('post', 'idx_post_categoryId');
    await queryInterface.removeIndex('post', 'idx_post_title');
  }
};
