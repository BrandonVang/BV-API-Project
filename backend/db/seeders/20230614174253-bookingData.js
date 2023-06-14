'use strict';


let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const bookingData = [
      {
        spotId: 1,
        userId: 1,
        startDate: new Date('2023-11-19'),
        endDate: new Date('2023-11-20'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        spotId: 2,
        userId: 2,
        startDate: new Date('2023-11-25'),
        endDate: new Date('2023-11-27'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more booking data if needed
    ];
    await queryInterface.bulkInsert('Bookings', bookingData);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'Bookings'
    await queryInterface.bulkDelete(options);
  }
};
