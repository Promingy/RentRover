'use strict';

const { Review } = require("../models");

let options = {};

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
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

    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        review: "Was absolutely amazing! Loved visiting Key West!",
        stars: 4
      },
      {
        spotId: 2,
        userId: 1,
        review: "FANTASTIC!",
        stars: 5
      },
      {
        spotId: 3,
        userId: 3,
        review: "Loved it!",
        stars:5
      },
      {
        spotId: 4,
        userId: 4,
        review: "Had an amazing time with the wife and kids. Getting to stay in a tree house was so cool!",
        stars: 4
      },
      {
        spotId: 5,
        userId: 5,
        review: "meh!",
        stars: 3
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
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, {
      spotId: {[Op.in]: [1, 2, 3, 4, 5]}
    })
  }
};
