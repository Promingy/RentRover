const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { check } = require('express-validator');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { handleValidationErrors, handleValidationErrorsNoTitle } = require('../../utils/validation');
const { User, Review, Spot, ReviewImage, SpotImage, Booking, Sequelize } = require('../../db/models');

const router = express.Router();

/// COME BACK AND TEST ONCE YOU CREATE BOOKINGS
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const Bookings = await Booking.findAll({
        include: {model: Spot, attributes:{exclude: ['description','createdAt', 'updatedAt']}},
        exclude: ['spotId'],
        where: {
            userId: user.id
        }
    });

    for (let booking of Bookings) {
        console.log(booking.Spot.id)
        const previewImage = await SpotImage.findByPk(booking.Spot.id, {
            where: {preview: true}
        })

        booking.Spot.dataValues.previewImage = previewImage.dataValues.url
    }

    res.json({Bookings})
})

/// COME BACK AND TEST ONCE YOU CREATE BOOKINGS


module.exports = router;
