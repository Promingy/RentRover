'use strict';

const { User } = require('../models');
const bcrypt = require('bcryptjs');

let options = {};

if(process.env.NODE_ENV === 'production'){
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

    await User.bulkCreate([
      {
        firstName: "Marshall",
        lastName: "Mathers",
        email: 'slimshady@user.io',
        username: 'Eminem',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        firstName: "Claudia",
        lastName: "Meza",
        email: 'snowwhite@user.io',
        username: 'SnowThaProduct',
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: "Russell",
        lastName: "Vitale",
        email: 'russell@user.io',
        username: 'Russ',
        hashedPassword: bcrypt.hashSync('password3')
      },
      {
        firstName: "Davood",
        lastName: "Asgari",
        email: 'dalock@user.io',
        username: 'Locksmith',
        hashedPassword: bcrypt.hashSync('password4')
      },
      {
        firstName: "Jeff",
        lastName: "Thompson",
        email: 'hearthop@user.io',
        username: 'Ekoh',
        hashedPassword: bcrypt.hashSync('password5')
      },
      {
        firstName: "Nathan",
        lastName: "Feuerstein",
        email: 'realmusic@user.io',
        username: 'fakeNF',
        hashedPassword: bcrypt.hashSync('password6')
      },
      {
        firstName: "Mark",
        lastName: "Richard",
        email: 'wonderifyouwonder@user.io',
        username: 'WittLowry',
        hashedPassword: bcrypt.hashSync('password7')
      },
      {
        firstName: "Leon",
        lastName: "Pearl",
        email: 'genkigenki@user.io',
        username: 'Miyachi',
        hashedPassword: bcrypt.hashSync('password8')
      },
      {
        firstName: "Ben",
        lastName: "Goldberg",
        email: 'tokenhiphop@user.io',
        username: 'Token',
        hashedPassword: bcrypt.hashSync('password9')
      },
      {
        firstName: "Jonathon",
        lastName: "Quiles",
        email: 'sikworld@user.io',
        username: 'SikWorld',
        hashedPassword: bcrypt.hashSync('password10')
      }
    ], {validate: true});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Eminem', 'SnowThaProduct', 'Russ', 'Locksmith', 'Ekoh', 'fakeNF', 'WittLowry', 'Miyachi', 'Token', 'SikWorld'] }
    }, {});
  }
};
