'use strict';

const { Booking } = require('../models');

let options = {};

if(process.env.NODE_ENV === 'production') {
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
   await Booking.bulkCreate([
    {
      spotId: 1,
      userId: 1,
      startDate: "2024-05-11",
      endDate: "2024-5-19",
    },
    {
      spotId: 2,
      userId: 3,
      startDate: "2024-01-22",
      endDate: "2024-02-12",
    },
    {
      spotId: 3,
      userId: 4,
      startDate: "2024-01-15",
      endDate: "2024-02-01",
    },
    {
      spotId: 4,
      userId: 2,
      startDate: "2024-06-29",
      endDate: "2024-07-15",
    },
    {
      spotId: 5,
      userId: 3,
      startDate: "2024-08-12",
      endDate: "2024-08-22",
    },
    {
      spotId: 5,
      userId: 10,
      startDate: "2024-09-12",
      endDate: "2024-09-22",
    },
    {
      spotId: 4,
      userId: 9,
      startDate: "2024-07-16",
      endDate: "2024-08-22",
    },
    {
      spotId: 3,
      userId: 8,
      startDate: "2024-04-17",
      endDate: "2024-05-20",
    },
    {
      spotId: 2,
      userId: 7,
      startDate: "2024-03-01",
      endDate: "2024-03-02",
    },
    {
      spotId: 1,
      userId: 6,
      startDate: "2024-05-20",
      endDate: "2024-05-29",
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
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: {[Op.in]: ["2024-08-12", "2024-06-29", "2024-01-15", "2024-01-22", "2024-05-11", "2024-09-12", "2024-07-16", "2024-04-17", "2024-03-01", "2024-05-20"]}
    })
  }
};
