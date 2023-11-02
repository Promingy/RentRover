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
      },
      {
        spotId: 1,
        userId: 6,
        review: "WOWZERS! This was our first time in the Keys and it absoltely blew us away. Russlle was a fantastic host!",
        stars: 5
      },
      {
        spotId: 2,
        userId: 7,
        review: "Garbage!",
        stars: 1
      },
      {
        spotId: 3,
        userId: 8,
        review: "Honestly, this place was alright, but I've been to better air-bnb's. If you're looking for an affordable place that's not terrible this place fits the bill.",
        stars:3
      },
      {
        spotId: 4,
        userId: 9,
        review: "Bugs everywhere, disgusting!",
        stars: 2
      },
      {
        spotId: 5,
        userId: 10,
        review: "BEST AIR-BNB I'VE EVER BEEN TO",
        stars: 5
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
      spotId: {[Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
    })
  }
};
