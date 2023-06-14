'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('SpotImages', [
      {
        spotId: 1,
        url: 'image_url_1',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

    ]);
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    return queryInterface.bulkDelete(options);
  }
};
