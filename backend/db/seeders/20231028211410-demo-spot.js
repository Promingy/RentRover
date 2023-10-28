'use strict';

const { Spot } = require('../models');

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

    await Spot.bulkCreate([
      {
        ownerId: 3,
        address: "915 Eisenhower Dr",
        city: "Key West",
        state: "Florida",
        country: "United States",
        lat: 24.5584866,
        lng: -81.7884532,
        name: "Spacious 2/2 Waterfront Condo",
        description: "Located in Old Town, Key West, you can walk/bike everywhere. Less than 1 mile to Duval Street, Seaport, Hemingway House, etc.",
        price: 545,
      },
      {
        ownerId: 2,
        address: "3785 Jade Ave",
        city: "Volcano",
        state: "Hawaii",
        country: "United States",
        lat: 19.4240716,
        lng: -155.2123434,
        name: "Volcano Teahouse Cottage",
        description: "Located just minutes away from Volcanoes National Park on 1/2 acre of private forest, the Teahouse Cottage was created with an appreciation for the elegance of Japanese architecture.",
        price: 395,
      },
      {
        ownerId: 1,
        address: "901 Miller Hill Ext Rd",
        city: "Fairbanks",
        state: "Alaska",
        country: "United States",
        lat: 64.902211,
        lng: -147.8806899,
        name: "Goldstream Yurt",
        description: "Spectacular aurora viewing, away from light pollution, and close winter trail access. This cozy yurt offers privacy amongst the spruce trees and will make you feel close to nature!",
        price: 160,
      },
      {
        ownerId: 5,
        address: "1661 Paleface Ranch Rd",
        city: "Spicewood",
        state: "Texas",
        country: "United States",
        lat: 30.4213661,
        lng: -98.1064844,
        name: "The Nest Treehouse Family Friendly Nature Escape",
        description: "The Nest includes two bedrooms, a lounge for games or late night reading, and a kitchenette/dining room, all nestled above the beautiful creek ravine.",
        price: 545,
      },
      {
        ownerId: 4,
        address: "383 W 1175 N",
        city: "Cedar City",
        state: "Utah",
        country: "United States",
        lat: 37.6981442,
        lng: -113.0657624,
        name: "Hobbit Cottage",
        description: "Perfectly located between Zion NP, Bryce Canyon, Kannarra Falls and Brian Head ski resort this unique custom built cottage is a Lord of the Rings hot spot! Whether you are a fan or not, this is a safe, cozy spot to rest from your adventures.",
        price: 68,
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      lat: {[Op.in]: [37.6981442, 30.4213661, 64.902211, 19.4240716, 24.5584866]}
    })
  }
};
