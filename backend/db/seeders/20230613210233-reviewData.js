'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

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
        review: "Great experience. Highly recommended!",
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        spotId: 2,
        review: "Not the best spot, but it was decent.",
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        spotId: 3,
        review: "Not the best spot, but it was decent.",
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        spotId: 3,
        review: "Not the best spot, but it was decent.",
        stars: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        spotId: 4,
        review: "Great experience. Highly recommended!",
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        spotId: 4,
        review: "Great experience. Highly recommended!",
        stars: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 1,
        spotId: 5,
        review: "Great experience. Highly recommended!",
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        spotId: 5,
        review: "Great experience. Highly recommended!",
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];
    options.tableName = 'Reviews'
    await queryInterface.bulkInsert(options, reviewSeedData);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Reviews'
    await queryInterface.bulkDelete(options);
  },
};
