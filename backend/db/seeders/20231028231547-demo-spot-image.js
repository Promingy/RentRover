'use strict';

const { SpotImage } = require('../models');
const { faker } = require('@faker-js/faker')

const options = {};

if (process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA
}

const spotImages = [];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    for (let i = 0; i < 99; i++){

        const newSpotImage = {
          spotId: i + 1,
          url: faker.image.url(),
          preview: true
        }
        const newSpotImage2 = {
          spotId: i + 1,
          url: faker.image.url(),
          preview: false
        }
        const newSpotImage3 = {
          spotId: i + 1,
          url: faker.image.url(),
          preview: false
        }
        const newSpotImage4 = {
          spotId: i + 1,
          url: faker.image.url(),
          preview: false
        }
        const newSpotImage5 = {
          spotId: i + 1,
          url: faker.image.url(),
          preview: false
        }

        spotImages.push(newSpotImage)
        spotImages.push(newSpotImage2)
        spotImages.push(newSpotImage3)
        spotImages.push(newSpotImage4)
        spotImages.push(newSpotImage5)

    }

    await SpotImage.bulkCreate(spotImages)

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

    return queryInterface.bulkDelete(options, spotImages)

  }
};
