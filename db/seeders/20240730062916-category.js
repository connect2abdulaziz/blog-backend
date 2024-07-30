'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      { tag: 'Technology', createdAt: new Date(), updatedAt: new Date() },
      { tag: 'Sports', createdAt: new Date(), updatedAt: new Date() },
      { tag: 'Health', createdAt: new Date(), updatedAt: new Date() },
      { tag: 'Entertainment', createdAt: new Date(), updatedAt: new Date() },
      { tag: 'Science', createdAt: new Date(), updatedAt: new Date() },
      { tag: 'Business', createdAt: new Date(), updatedAt: new Date() },
      { tag: 'Education', createdAt: new Date(), updatedAt: new Date() },
      { tag: 'Travel', createdAt: new Date(), updatedAt: new Date() },
      { tag: 'Food', createdAt: new Date(), updatedAt: new Date() },
      { tag: 'Lifestyle', createdAt: new Date(), updatedAt: new Date() }
    ];

    await queryInterface.bulkInsert('category', categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('category', null, {});
  }
};
