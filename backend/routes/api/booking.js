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
        const { bookingId } = req.params;
        const { user } = req;
        const bookingToEdit = await Booking.findByPk(bookingId);

        if(!bookingToEdit) return true

        const spot = await Spot.findByPk(bookingToEdit['spotId'])
        const bookings = await Booking.findAll({
            where: {
                spotId: bookingToEdit['spotId']
            }
        });


        if(!bookings.length || spot['ownerId'] == user.id || !spot){
            return true
        }

        let endDate = new Date(value).toDateString();
        endDate =  new Date(endDate).getTime();

        for (let booking of bookings){
            if (booking['id'] == bookingId) continue;

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
        const { bookingId } = req.params;
        let { endDate } = req.body;
        const { user } = req;
        const bookingToEdit = await Booking.findByPk(bookingId);

        if (!bookingToEdit) return true

        const spot = await Spot.findByPk(bookingToEdit['spotId']);
        const bookings = await Booking.findAll({
            where: {
                spotId: bookingToEdit['spotId']
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
            if (booking['id'] == bookingId) continue;


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
    const updatedBookings = []

    for (let booking of Bookings) {
        let previewImage = await SpotImage.findByPk(booking.Spot.id, {
            where: {preview: true}
        })

        booking = booking.toJSON()
        previewImage = previewImage.toJSON()

        const createdAt = booking['createdAt'].toLocaleString();
        const updatedAt = booking['updatedAt'].toLocaleString();
        startDate = booking['startDate'].toLocaleString();
        endDate = booking['endDate'].toLocaleString();

        booking.startDate = startDate.split('/').join('-').slice(0, 10);
        booking.endDate = endDate.split('/').join('-').slice(0, 10);
        booking.createdAt = createdAt.split('/').join('-')
        booking.updatedAt = updatedAt.split('/').join('-')

        booking.Spot.previewImage = previewImage.url
        updatedBookings.push(booking)
    }

    res.json({Bookings: updatedBookings})
})

router.put('/:bookingId', [requireAuth, bookingValidator, bookingConflicts], async (req, res) => {
    const { user } = req;
    const { bookingId } = req.params;
    let { startDate, endDate } = req.body;
    let booking = await Booking.findByPk(bookingId);

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

    await booking.update({
        startDate,
        endDate
    })

    booking = booking.toJSON();

    const createdAt = booking['createdAt'].toLocaleString();
    const updatedAt = booking['updatedAt'].toLocaleString();
    startDate = booking['startDate'].toLocaleString();
    endDate = booking['endDate'].toLocaleString();

    booking.startDate = startDate.split('/').join('-').slice(0, 10);
    booking.endDate = endDate.split('/').join('-').slice(0, 10);
    booking.createdAt = createdAt.split('/').join('-');
    booking.updatedAt = updatedAt.split('/').join('-');

    res.json(booking)
});

router.delete('/:bookingId', requireAuth, async (req, res) => {
    const { user } = req;
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId);

    if (!booking) {
        return res.status(404).json(
            {
                "message": "Booking couldn't be found"
              }
        )
    };

    let startTime = booking['startTime'];

    startTime = new Date(startTime).toDateString();
    startTime = new Date(startTime).getTime();


    if (booking['userId'] !== user.id){
       return res.status(403).json({ message: "Forbidden"})
    };

    if (startTime < new Date()){
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted"
        })
    }

    await booking.destroy();

    res.json({ message: "Successfully deleted"});
})

module.exports = router;
