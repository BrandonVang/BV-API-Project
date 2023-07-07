'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-915224139956934659/original/f7c60aa1-cf7f-4e5c-8510-363e4f5db9eb.jpeg?im_w=720',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-898622005542393497/original/f9c54b91-bfb8-4116-bcbd-550cbee5c5db.jpeg?im_w=720',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/68bc4aab-a736-417f-b7b6-ff2f1036bfc0.jpg?im_w=720',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        spotId: 4,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-31861233/original/e22a7726-007d-48fa-bdc6-3170676a152f.jpeg?im_w=720',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        spotId: 5,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-657321492805298234/original/d5b7a332-39d5-48e7-8781-ecf0172ae336.jpeg?im_w=720',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        spotId: 6,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-45492080/original/9487a0a0-8139-475b-833d-6de200ceda1e.jpeg?im_w=720',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        spotId: 7,
        url: 'https://a0.muscache.com/im/pictures/prohost-api/Hosting-915240844449954185/original/e5c84fb0-c342-47bf-af79-25824b9cd6e0.jpeg?im_w=720',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 8,
        url: 'https://a0.muscache.com/im/pictures/monet/Select-18917696/original/d630e8de-2433-4a79-b6b0-df21fdd3ee92?im_w=720',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 9,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-40426632/original/dd8e6156-1226-4a1b-8aff-06b42c1f55a5.jpeg?im_w=720',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 10,
        url: 'https://a0.muscache.com/im/pictures/airflow/Hosting-30113838/original/eaf21a0a-3c44-43df-81c4-f46b3501e7f1.jpg?im_w=720',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },


    ]);
  },

  async down(queryInterface, Sequelize) {
    options.tableName = 'SpotImages'
    await queryInterface.bulkDelete(options);
  }
};
