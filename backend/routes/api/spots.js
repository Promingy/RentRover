const express = require('express')
const bcrypt = require('bcryptjs')
const { check } = require('express-validator')

const { handleValidationErrors, handleBookings } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking, Sequelize } = require('../../db/models');


const router = express.Router();

const validBodySpot = [
    check('address')
        .exists({ checkFalsy: true})
        .withMessage ('Street address is required'),
    check('city')
        .exists({checkFalsy: true})
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true})
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Country is required'),
    check('lat')
        .isFloat({
            max: 90,
            min: -90
        })
        .withMessage('Latitude is not valid'),
    check('lng')
        .isFloat({
            max: 180,
            min: -180
        })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .isFloat({
            min: 1
        })
        .withMessage('Price per day is required'),
        handleValidationErrors
]

const validBodyReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .isInt({
            max: 5,
            min: 1
        })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

const bookingValidator = [

    check('endDate')
        .custom((value, {req}) => {
            const {startDate} = req.body
            const endDateString = new Date(value).toDateString();
            const startDateString = new Date(startDate).toDateString();

            const endDateTime = new Date(endDateString).getTime();
            const startDateTime = new Date(startDateString).getTime();

            return !(endDateTime <= startDateTime)
        })
        .withMessage(`endDate cannot be on or before startDate`),
        handleValidationErrors

];

const bookingConflicts = [
    check('endDate')
    .custom(async (value, { req }) => {
        const { spotId } = req.params;
        const bookings = await Booking.findAll({
            where: {
                spotId
            }
        });

        const endDate = new Date(value).toDateString();
        const endDateTime =  new Date(endDate).getTime();

        for (let booking of bookings){
            const bookingStartDate = new Date(booking['startDate']).toDateString();
            const bookingStartDateTime = new Date(bookingStartDate).getTime();

            const bookingEndDate = new Date(booking['endDate']).toDateString();
            const bookingEndDateTime = new Date(bookingEndDate).getTime();

            if(endDateTime > bookingStartDateTime && endDateTime <= bookingEndDateTime){
                throw Error
            }
        }
        return true
    })
    .withMessage('End date conflicts with an existing booking'),
check('startDate')
    .custom(async (value, { req }) => {
        const { spotId } = req.params;
        const bookings = await Booking.findAll({
            where: {
                spotId
            }
        });

        const startDate = new Date(value).toDateString();
        const startDateTime =  new Date(startDate).getTime();

        for (let booking of bookings){
            const bookingStartDate = new Date(booking['startDate']).toDateString();
            const bookingStartDateTime = new Date(bookingStartDate).getTime();

            const bookingEndDate = new Date(booking['endDate']).toDateString();
            const bookingEndDateTime = new Date(bookingEndDate).getTime();

            if(startDateTime > bookingStartDateTime && startDateTime <= bookingEndDateTime){
                throw Error
            }
        }
        return true
    })
    .withMessage('Start date conflicts with an existing booking'),

handleBookings
];

router.get('/', async (_req, res) => {
    let Spots = await Spot.findAll({
        // attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt', [Sequelize.literal('SpotImage.url'), 'previewImage']],
        // include: [{model: SpotImage, as: 'SpotImage', attributes: []}]
    });

    const updatedSpots = []

    for (let spot of Spots) {
        const stars = await Review.sum('stars', {
            where: { spotId: spot.id}
        })
        const numOfReviews = await Review.count({
            where: { spotId: spot.id}
        })

        let url = await SpotImage.findOne({
            attributes: ['url'], where: {spotId: spot.id, preview: true}
        });

        avgRating = stars / numOfReviews

        spot = spot.toJSON()
        if(url) url = url.toJSON()

        spot.avgRating = avgRating
        if(url) spot.previewImage = url.url

        updatedSpots.push(spot)
        // spot.dataValues.avgRating = avgRating
        // spot.dataValues.previewImage = url.dataValues.url
    }
    return res.json({Spots: updatedSpots})
});

router.post('/', [requireAuth, validBodySpot], async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { user } = req

    const newSpot = await Spot.create({
        "ownerId": user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    });

    res.status(201)
    res.json(newSpot)
});

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const spots = await Spot.findAll({
        where: {
            ownerId: user.id
        }
    })

    res.json(spots)
});

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const spots = await Spot.findAll({
        where: {
            ownerId: user.id
        }
    })

    res.json(spots)
});

router.get('/:spotId', async (req, res) => {
    const { spotId } = req.params;
    let spot = await Spot.findByPk(spotId, {
        include: {
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
        }
    })

    if(!spot) {
        res.status(404);
        return res.json(
            {
            "message": "Spot couldn't be found"
          })
    }

    const Owner = await User.findByPk(spot.ownerId, {
        attributes: {exclude: ['username']}
    })

    const reviews = await Review.count({
        where: {spotId}
    })

    const totalRating = await Review.sum('stars',{
        where: {spotId}
    })

    const avgRating = totalRating / reviews

    spot = spot.toJSON();

    spot.numReviews = reviews
    spot.avgRating = avgRating
    spot.Owner = Owner

    res.json(spot)
});

router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { user } = req;
    const { spotId } = req.params;
    const { url, preview } = req.body;
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.status(404);
        return res.json(
            {
            "message": "Spot couldn't be found"
          })
    }

    if (user.id !== spot['ownerId']){
        res.status(403).json(
         {
             "message": "Forbidden"
           }
        )
     };

    const newSpotImage = await SpotImage.create({
        spotId,
        url,
        preview
    });

    res.json({
        id: newSpotImage.id,
        url,
        preview
    })

});

router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    if(!spot) {
        res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }

    const Reviews = await Review.findAll({
        include: [
            {model: User, attributes: ['id', 'firstName', 'lastName']},
            {model: ReviewImage, attributes: ['id','url']}],
        where: {
            spotId
        }
    });

    res.json({Reviews})
})

router.post('/:spotId/reviews', [requireAuth, validBodyReview], async (req, res) => {
    const { user } = req;
    const { review, stars } = req.body;
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    const prevReview = await Review.findOne({
        where: {userId: user.id,
                spotId}
    })

    if (prevReview) {
        return res.status(500).json(
            {
            "message": "User already has a review for this spot"
          })
    }

    if(!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found"
          })
    }

    const newReview = await Review.create({
        userId: user.id,
        spotId,
        review,
        stars
    })

    res.status(201).json(newReview)
})

router.put('/:spotId', [requireAuth, validBodySpot], async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { user } = req;
    const { spotId } = req.params;
    let spot = await Spot.findByPk(spotId);

    if (!spot) {
        res.status(404);
        return res.json(
            {
            "message": "Spot couldn't be found"
          })
    }

    if(user.id !== spot['ownerId']){
        res.status(403).json(
            {
            "message": "Forbidden"
          })
    }

    await spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    }).catch(err => res.status(400))


    res.json(spot)
});

router.delete('/:spotId', requireAuth, async (req, res) => {
    const { user } = req;
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    if(spot['ownerId'] !== user.id ) {
        res.status(403).json(
            {
            "message": "Forbidden"
          })
    }

    if(!spot) {
        return res.status(404).json(
            {
            "message": "Spot couldn't be found"
         });
    };

    await spot.destroy();
    return res.json(
        {
        "message": "Successfully deleted"
      })

});

router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    /*
     /   if user is owner of spot, get all bookings for spot
     /   if user is not owner, get only current users bookings
    */
   const { user } = req;
   const { spotId } = req.params;
   const spot = await Spot.findByPk(spotId);

   if (!spot) {
        res.status(404).json(
            {
                "message": "Spot couldn't be found"
              }
        )
   }

   let bookings;

   if (spot['ownerId'] === user.id) {
        bookings = await Booking.findAll({
            include: {model: User, attributes: ['id', 'firstName', 'lastName']},
            where: {spotId}
        })
   } else {
        bookings = await Booking.findAll({
            where: {spotId, userId: user.id},
            attributes: ['spotId', 'startDate', 'endDate']
        })
   }

   res.json(bookings);

});

router.post('/:spotId/bookings', [requireAuth, bookingValidator, bookingConflicts], async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const { startDate, endDate } = req.body;
    const spot = await Spot.findByPk(spotId);

    if(!spot){
        res.status(404).json(
            {
                "message": "Spot couldn't be found"
              }
        )
    };

    //! may need to be updated. This disallows owner to book on their own spot
    if(user.id === spot['ownerId']){
        res.status(403).json(
            {
                "message": "Forbidden"
              }
        )
    };

    const newBooking = await Booking.create({
        userId: user.id,
        spotId,
        startDate,
        endDate
    });

    res.json(newBooking)
})

module.exports = router;
