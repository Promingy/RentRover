'use strict';

const { ReviewImage } = require('../models');

const options = {};

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

    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "https://symphony.cdn.tambourine.com/oceans-edge-key-west-hotel/media/oekw-homepage-trs-03-610c0eb91f29c-optimized.webp"
      },
      {
        reviewId: 2,
        url: "https://lp-cms-production.imgix.net/2021-11/GettyImages-954413290.jpg"
      },
      {
        reviewId: 3,
        url: "https://www.thoughtco.com/thmb/7qI5tG7yIqWL1zWnY2RMqCxp9hI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/166370483-56cb36da5f9b5879cc54103c-5c54ad6b46e0fb00013a2205.jpg"
      },
      {
        reviewId: 4,
        url: "https://a0.muscache.com/im/pictures/prohost-api/Hosting-53256465/original/772f9805-947e-4ed3-9526-93007f99fe79.jpeg?im_w=720"
      },
      {
        reviewId: 5,
        url: "https://www.nztravelorganiser.com/wp-content/uploads/2019/09/hobbiton-1024x683.jpg"
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
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: {[Op.in]: [1, 2, 3, 4, 5]}
    })
  }
};
