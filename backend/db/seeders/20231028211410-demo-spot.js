'use strict';

const { Spot } = require('../models');
const { faker } = require('@faker-js/faker')

let options = {};
let spots = [];

if(process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    for (let i = 0; i < 100; i++) {
      const newSpot = {
        ownerId: faker.number.int({min: 1, max: 99}),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        lat: faker.location.latitude(),
        lng: faker.location.longitude(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({min:10, max: 1000})
      }

      spots.push(newSpot)
    }

    await Spot.bulkCreate(spots)

  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Spots';
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, spots)

  }
};
