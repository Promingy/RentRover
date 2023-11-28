const { faker } = require('@faker-js/faker')

'use strict';

const { User } = require('../models');
const bcrypt = require('bcryptjs');

let options = {};

if(process.env.NODE_ENV === 'production'){
  options.schema = process.env.SCHEMA;
}

const users = []

module.exports = {
  async up (queryInterface, Sequelize) {

    for (let i = 0; i < 100; i++){
      const password = faker.internet.password();

      const newUser = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        username: faker.internet.userName(),
        hashedPassword: bcrypt.hashSync(password)
      }

      users.push(newUser)
    }

    await User.bulkCreate([
      ...users,
      {
        firstName: "Marshall",
        lastName: "Mathers",
        email: 'slimshady@user.io',
        username: 'Eminem',
        hashedPassword: bcrypt.hashSync('password')
      }
    ])

  },

  async down (queryInterface, Sequelize) {

    options.tableName = 'Users';
    const Op = Sequelize.Op;

    return queryInterface.bulkDelete(options, users)

  }
};
