'use strict';

const { SpotImage } = require('../models');

const options = {};

if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://a0.muscache.com/im/pictures/miso/Hosting-980411284040333987/original/9ca4633f-9ca7-4854-acc2-90a6b0b2ce0d.jpeg?im_w=960",
        preview: true
      },
      {
        spotId: 2,
        url: "https://a0.muscache.com/im/pictures/d025a5b8-726b-4798-a6db-0c20b100ab7b.jpg?im_w=720",
        preview: true
      },
      {
        spotId: 3,
        url: "https://a0.muscache.com/im/pictures/e55eee04-6348-47d0-858e-430376c8a420.jpg?im_w=960",
        preview: true
      },
      {
        spotId: 4,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-53256465/original/a3a6d577-5c0f-4648-a458-68d7fa18ed98.jpeg?im_w=960",
        preview: true
      },
      {
        spotId: 5,
        url: "testImage2.url",
        preview: true
      },
      {
        spotId: 1,
        url: "testImage2.url",
        preview: false
      },
      {
        spotId: 2,
        url: "testImage2.url",
        preview: false
      },
      {
        spotId: 3,
        url: "testImage2.url",
        preview: false
      },
      {
        spotId: 4,
        url: "testImage2.url",
        preview: false
      },
      {
        spotId: 5,
        url: "testImage2.url",
        preview: false
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages'
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, {
      preview: {[Op.in]: [true, false]}
    })
  }
};
