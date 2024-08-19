'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('comment', ['userId'], {
      name: 'idx_comment_userId',
      unique: false
    });

    await queryInterface.addIndex('comment', ['postId'], {
      name: 'idx_comment_postId',
      unique: false
    });

    await queryInterface.addIndex('comment', ['parentId'], {
      name: 'idx_comment_parentId',
      unique: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('comment', 'idx_comment_userId');
    await queryInterface.removeIndex('comment', 'idx_comment_postId');
    await queryInterface.removeIndex('comment', 'idx_comment_parentId');
  }
};
