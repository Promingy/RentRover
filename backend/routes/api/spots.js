const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { Op } = require('sequelize');


const { handleValidationErrors, handleBookings, handleValidationErrorsNoTitle, handleQueries } = require('../../utils/validation');
const { setTokenCookie, requireAuth, authorize } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking,  } = require('../../db/models');


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
        handleValidationErrorsNoTitle
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
        handleValidationErrorsNoTitle
]

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

const handleQueryErrors = [
    check('page')
        .custom(({req}) => {
            const { page } = req.query;

            if (page < 1) return false
        })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .custom(({req}) => {
            const { size } = req.query;

            if (size < 1) return false
        })
        .withMessage('Size must be greater than or equal to 1'),
    check('maxLat')
        .custom(({req}) => {
            const { maxLat } = req.query;

            if (maxLat > 90) return false
        })
        .withMessage('Maximum latitude is invalid'),
    check('minLat')
        .custom(({req}) => {
            const { minLat } = req.query;

            if (minLat < -90) return false
        })
        .withMessage('Minimum latitude is invalid'),
    check('minLng')
        .custom(({req}) => {
            const { minLng } = req.query;

            if (minLng < -180) return false
        })
        .withMessage('Minimum longitude is invalid'),
    check('maxLng')
        .custom(({req}) => {
            const { maxLng } = req.query;

            if (maxLng > 180) return false
        })
        .withMessage('Maximum longitude is invalid'),
    check('minPrice')
        .custom(({req}) => {
            const { minPrice } = req.query;

            if (minPrice < 1) return false
        })
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .custom(({req}) => {
            const { maxPrice } = req.query;

            if (maxPrice < 1) return false
        })
        .withMessage('Maximum price must be greate than or equal to 0'),
    handleQueries
]

router.get('/', handleQueryErrors, async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    page = page >= 1 && page <= 10 ? page : 1;
    size = size >= 1 && size <= 20 ? size : 20;

    let where = {};

    if (parseFloat(minLat)) {
        minLat = parseFloat(minLat)
        where.lat = {...where.lat,
                    [Op.gt]: minLat}
    };

    if (parseFloat(maxLat)) {
        maxLat = parseFloat(maxLat);
        where.lat = {...where.lat,
                [Op.lt]: maxLat
                }
    }
    if (parseFloat(minLng)) {
        minLng = parseFloat(minLng)
        where.lng = { ... where.lng,
                        [Op.gt]: minLng}
    }
    if (parseFloat(maxLng)) {
        maxLng = parseFloat(maxLng)
        where.lng = { ...where.lng,
                        [Op.lt]: maxLng}
    }
    if (parseFloat(minPrice)) {
        minPrice = parseFloat(minPrice)
        where.price = {...where.price,
                        [Op.gt]: minPrice}
    }
    if (parseFloat(maxPrice)) {
        maxPrice = parseFloat(maxPrice)
        where.price = {...where.price,
                        [Op.lt]: maxPrice}
    }


    let Spots = await Spot.findAll({
            where,
            limit: size,
            offset: size * (page - 1)});

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
    }
    return res.json({Spots: updatedSpots, page, size})
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
    const Spots = await Spot.findAll({
        where: {
            ownerId: user.id
        }
    })

    res.json({Spots})
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

router.post('/:spotId/images', [requireAuth], async (req, res) => {
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
    })


    res.json(spot)
});

router.delete('/:spotId', requireAuth, async (req, res) => {
    const { user } = req;
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    if(!spot) {
        return res.status(404).json(
            {
            "message": "Spot couldn't be found"
         });
    };


    if(spot['ownerId'] !== user.id ) {
        res.status(403).json(
            {
            "message": "Forbidden"
          })
    }

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

   let Bookings;

   if (spot['ownerId'] === user.id) {
        Bookings = await Booking.findAll({
            include: {model: User, attributes: ['id', 'firstName', 'lastName']},
            where: {spotId}
        })
   } else {
        Bookings = await Booking.findAll({
            where: {spotId, userId: user.id},
            attributes: ['spotId', 'startDate', 'endDate']
        })
   }

   res.json({Bookings});

});

router.post('/:spotId/bookings', [requireAuth, bookingValidator, bookingConflicts], async (req, res) => {
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
        spotId: +spotId,
        startDate,
        endDate
    });

    res.json(newBooking)
})

module.exports = router;
