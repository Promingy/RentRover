const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { check } = require('express-validator');


const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { handleValidationErrors, handleValidationErrorsNoTitle, handleBookings } = require('../../utils/validation');
const { User, Review, Spot, ReviewImage, SpotImage, Booking, Sequelize } = require('../../db/models');

const router = express.Router();

const bookingValidator = [

    check('endDate')
        .custom((value, {req}) => {
            let {startDate} = req.body
            let endDateString = new Date(value).toDateString();
            let startDateString = new Date(startDate).toDateString();

            let endDateTime = new Date(endDateString).getTime();
            let startDateTime = new Date(startDateString).getTime();

            return !(endDateTime <= startDateTime)
        })
        .withMessage(`endDate cannot be on or before startDate`),
        handleValidationErrorsNoTitle

];

const bookingConflicts = [
    check('endDate')
    .custom(async (value, { req }) => {
        const { spotId } = req.params;
        const { user } = req;
        const spot = await Spot.findByPk(spotId);
        const bookings = await Booking.findAll({
            where: {
                spotId
            }
        });

        if(!bookings.length || spot['ownerId'] == user.id){
            return true
        }

        let endDate = new Date(value).toDateString();
        endDate =  new Date(endDate).getTime();

        for (let booking of bookings){
            let bookingStartDate = new Date(booking['startDate']).toDateString();
            bookingStartDate = new Date(bookingStartDate).getTime();

            let bookingEndDate = new Date(booking['endDate']).toDateString();
            bookingEndDate = new Date(bookingEndDate).getTime();

            if(endDate >= bookingStartDate && endDate <= bookingEndDate){
                throw Error
            }
        }
        return true
    })
    .withMessage('End date conflicts with an existing booking'),
check('startDate')
    .custom(async (value, { req }) => {
        const { spotId } = req.params;
        let { endDate } = req.body;
        const { user } = req;
        const spot = await Spot.findByPk(spotId);
        const bookings = await Booking.findAll({
            where: {
                spotId
            }
        });

        if(!bookings.length || spot['ownerId'] == user.id){
            return true
        }

        let startDate = new Date(value).toDateString();
        startDate =  new Date(startDate).getTime();

        endDate = new Date(endDate).toDateString();
        endDate = new Date(endDate)

        for (let booking of bookings){
            let bookingStartDate = new Date(booking['startDate']).toDateString();
            bookingStartDate = new Date(bookingStartDate).getTime();

            let bookingEndDate = new Date(booking['endDate']).toDateString();
            bookingEndDate = new Date(bookingEndDate).getTime();

            if(startDate >= bookingStartDate && startDate <= bookingEndDate){
                throw Error
            }else if(startDate < bookingStartDate && endDate > bookingEndDate){
                throw Error
            }
        }
        return true
    })
    .withMessage('Start date conflicts with an existing booking'),

handleBookings
];

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

router.put('/:bookingId', [requireAuth, bookingValidator, bookingConflicts], async (req, res) => {
    const { user } = req;
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        res.status(404).json(
            {
                "message": "Booking couldn't be found"
              }
        )
    }

    if (booking['userId'] !== user.id) {
        res.status(403).json({ message: 'Forbidden'})
    }

    res.json('im a test')
})

module.exports = router;
