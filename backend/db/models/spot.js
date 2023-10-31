'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId'
      }),

      Spot.belongsToMany(models.User, {
        through: models.Booking,
        foreignKey: 'spotId',
        otherKey: 'userId'
      }),

      Spot.belongsToMany(models.User, {
        through: models.Review,
        foreignKey: 'spotId',
        otherKey: 'userId'
      }),

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        // as: 'SpotImage'
      }),

      Spot.hasMany(models.Review, {
        foreignKey: 'spotId'
      }),

      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId'
      })

    }
  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Street address is required' }
      }
    },
    city: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'City is required'}
      }
    },
    state: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'State is required'}
      }
    },
    country: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: 'Country is required'}
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true,
        max: {args: 90, msg: 'Latitude is not valid'},
        min: {args: -90, msg: 'Latitude is not valid'}
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true,
        max: { args: 180, msg: 'Longitude is not valid'},
        min: { args: -180, msg: 'Longitude is not valid'}
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {args: [3, 50], msg: 'Name must be less than 50 characters'}
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "Description is required"}
      }
    },
    price: {
      type: DataTypes.DECIMAL,
      validate: {
        isDecimal: true,
        min: { args: 1, msg: 'Price per day is required'}
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
