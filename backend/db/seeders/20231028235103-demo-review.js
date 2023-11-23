'use strict';

const { faker } = require("@faker-js/faker");
const { Review } = require("../models");

let options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

const reviews = []

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    for (let i = 1; i < 100; i ++){
      const spotId1 = faker.number.int({max: 49, min: 1})
      let spotId2 = faker.number.int({max: 99, min: 50})

      let review1 = faker.lorem.lines({max: 5, min: 1})
      let review2 = faker.lorem.lines({max: 5, min: 1})

      while (review1.length > 255) review1 = faker.lorem.lines({max: 5, min: 1})
      while (review2.length > 255) review2 = faker.lorem.lines({max: 5, min: 1})

      const newReview = {
        spotId: spotId1,
        userId: i,
        review: faker.lorem.lines({max: 5, min: 1}),
        stars: faker.number.int({max: 5, min: 1})
      }
      const newReview2 = {
        spotId: spotId2,
        userId: i,
        review: faker.lorem.lines({max: 5, min: 1}),
        stars: faker.number.int({max: 5, min: 1})
      }
      reviews.push(newReview)
      reviews.push(newReview2)
    }

    await Review.bulkCreate(reviews)

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, reviews)
  }
};
