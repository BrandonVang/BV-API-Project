'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    // Fetch the primary key values for the users and spots
    const users = await queryInterface.sequelize.query('SELECT id FROM User;');
    const spots = await queryInterface.sequelize.query('SELECT id FROM Spot;');

    // Use the retrieved primary key values in the review seed data
    const reviewData = [
      {
        userId: users[0][0].id,
        spotId: spots[0][0].id,
        review: "This was an awesome spot!",
        stars: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more review data if needed
    ];

    // Insert the review data into the Reviews table
    await queryInterface.bulkInsert('Reviews', reviewData);

    // Update the auto-increment sequence for the Reviews table
    await queryInterface.sequelize.query('UPDATE SQLITE_SEQUENCE SET SEQ=1 WHERE NAME="Reviews";');
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Reviews', null, {});
  }
};
