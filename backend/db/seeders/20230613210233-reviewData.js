'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const reviewSeedData = [
      {
        userId: 1,
        spotId: 1,
        review: "This was an awesome spot!",
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        spotId: 1,
        review: "Great experience. Highly recommended!",
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        spotId: 2,
        review: "Not the best spot, but it was decent.",
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Reviews', reviewSeedData, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Reviews', null, {});
  },
};
