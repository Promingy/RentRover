const express = require('express');
const { check } = require('express-validator');
const { Op } = require('sequelize');

const { ifExists, handleBookings, handleValidationErrorsNoTitle, handleQueries, objFormatter } = require('../../utils/validation');
const { requireAuth, authorize } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking } = require('../../db/models');

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
        .withMessage('Latitude must be between -90 and 90'),
    check('lng')
        .isFloat({
            max: 180,
            min: -180
        })
        .withMessage('Longitude must be between -180 and 180'),
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

        let newEnd = new Date(value).toDateString();
        newEnd =  new Date(newEnd).getTime();

        for (let booking of bookings){
            let existingStart = new Date(booking['startDate']).toDateString();
            existingStart = new Date(existingStart).getTime();

            let existingEnd = new Date(booking['endDate']).toDateString();
            existingEnd = new Date(existingEnd).getTime();

            if(newEnd >= existingStart && newEnd <= existingEnd){
                throw Error
            }
        }
        return true
    })
    .withMessage('End date conflicts with an existing booking'),
check('startDate')
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

        let newStart = new Date(value).toDateString();
        newStart =  new Date(newStart).getTime();

        newEnd = new Date(req.body.endDate).toDateString();
        newEnd = new Date(newEnd)

        for (let booking of bookings){
            let existingStart = new Date(booking['startDate']).toDateString();
            existingStart = new Date(existingStart).getTime();

            let existingEnd = new Date(booking['endDate']).toDateString();
            existingEnd = new Date(existingEnd).getTime();

            if(newStart >= existingStart && newStart <= existingEnd){
                throw Error
            }else if(newStart < existingStart && newEnd > existingEnd){
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
        .custom((value, {req}) => {
            const { page } = req.query;

            return page && page < 1 ? false : true

        })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .custom((value, {req}) => {
            const { size } = req.query;

            return size && size < 1 ? false : true
        })
        .withMessage('Size must be greater than or equal to 1'),
    check('maxLat')
        .custom((value, {req}) => {
            const { maxLat, minLat } = req.query;

            return maxLat && maxLat > 90 || minLat > maxLat ? false : true
        })
        .withMessage('Maximum latitude cannot be greater than 90'),
    check('minLat')
        .custom((value, {req}) => {
            const { minLat, maxLat } = req.query;

            return minLat && minLat < -90 || minLat > 90 || minLat > maxLat ? false : true
        })
        .withMessage('Minimum latitude cannot be less than -90'),
    check('minLng')
        .custom((value, {req}) => {
            const { minLng, maxLng } = req.query;

            return minLng && minLng < -180 || minLng > 180 || minLng > maxLng ? false : true
        })
        .withMessage('Minimum longitude cannot be less than -180'),
    check('maxLng')
        .custom((value, {req}) => {
            const { maxLng, minLng } = req.query;

            return maxLng && maxLng > 180 || +maxLng < +minLng ? false : true
        })
        .withMessage('Maximum longitude cannot be greater than 180'),
    check('minPrice')
        .custom((value, {req}) => {
            const { minPrice } = req.query;

            return minPrice && +minPrice < 1 ? false : true
        })
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .custom((value, {req}) => {
            const { maxPrice } = req.query;

            return maxPrice && +maxPrice < 1 ? false : true
        })
        .withMessage('Maximum price must be greater than or equal to 0'),
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

        spot = objFormatter(spot)

        // if(url) url = url.toJSON()

        spot.avgRating = avgRating ? avgRating : `This spot has no ratings`
        // if(url) spot.previewImage = url.url

        spot.previewImage = url ? url.url : `No preview image available`

        updatedSpots.push(spot)
    }

    if(Object.keys(req.query).length === 0) return res.json({Spots: updatedSpots})
    return res.json({Spots: updatedSpots, page, size})
});

router.post('/', [requireAuth, validBodySpot], async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { user } = req

    let newSpot = await Spot.create({
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

    newSpot = objFormatter(newSpot)

    res.status(201)
    res.json(newSpot)
});

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const Spots = await Spot.findAll({
        where: {
            ownerId: user.id
        }
    });

    const updatedSpots = [];

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

        avgRating = stars / numOfReviews;

        spot = objFormatter(spot)
        // if(url) url = url.toJSON();

        spot.avgRating = avgRating ? avgRating : `This spot has no ratings`;

        spot.previewImage = url ? url.url : `No preview image available`

        updatedSpots.push(spot);
    }

    res.json({Spots: updatedSpots})
});

router.get('/:spotId', ifExists, async (req, res) => {
    const { spotId } = req.params;
    let spot = await Spot.findByPk(spotId, {
        include: {
            model: SpotImage,
            attributes: ['id', 'url', 'preview']
        }
    })

    const Owner = await User.findByPk(spot.ownerId, {
        attributes: {exclude: ['username']}
    })

    const reviews = await Review.count({
        where: {spotId}
    })

    const totalRating = await Review.sum('stars',{
        where: {spotId}
    })

    let url = await SpotImage.findOne({
        attributes: ['url'], where: {spotId: spot.id, preview: true}
    });

    const avgRating = totalRating / reviews

    spot = objFormatter(spot)

    spot.numReviews = reviews;
    spot.avgRating = avgRating ? avgRating : `This spot has no ratings`;
    spot.previewImage = url ? url.url : `No preview image available`
    spot.Owner = Owner;


    res.json(spot);
});

router.post('/:spotId/images', [requireAuth, authorize, ifExists], async (req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;

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

router.get('/:spotId/reviews', ifExists, async (req, res) => {
    const { spotId } = req.params;

    const Reviews = await Review.findAll({
        include: [
            {model: User, attributes: ['id', 'firstName', 'lastName']},
            {model: ReviewImage, attributes: ['id','url']}],
        where: {
            spotId
        },
        order: [[ReviewImage, 'id']]
    });

    const returnReviews = [];

    for (let review of Reviews) {
        review = objFormatter(review);

        returnReviews.push(review)
    }

    res.json({Reviews: returnReviews})
})

router.post('/:spotId/reviews', [requireAuth, ifExists, validBodyReview], async (req, res) => {
    const { user } = req;
    const { review, stars } = req.body;
    const { spotId } = req.params;
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

    let newReview = await Review.create({
        userId: user.id,
        spotId: +spotId,
        review,
        stars: +stars
    });

    newReview = objFormatter(newReview)

    res.status(201).json(newReview)
})

router.put('/:spotId', [requireAuth, authorize, ifExists, validBodySpot], async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { spotId } = req.params;
    let spot = await Spot.findByPk(spotId);

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

    spot = objFormatter(spot)

    res.json(spot)
});

router.delete('/:spotId', [requireAuth, authorize, ifExists], async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);

    await spot.destroy();
    return res.json(
        {
        "message": "Successfully deleted"
      })

});

router.get('/:spotId/bookings', [requireAuth, ifExists], async (req, res) => {
   const { user } = req;
   const { spotId } = req.params;
   const spot = await Spot.findByPk(spotId);

   let Bookings = [];

   if (spot['ownerId'] === user.id) {
        let preBookings = await Booking.findAll({
            include: {model: User, attributes: ['id', 'firstName', 'lastName']},
            where: {spotId}
        })

        for (let booking of preBookings) {
            booking = objFormatter(booking);

            Bookings.push(booking)
        }
   } else {
        let preBookings = await Booking.findAll({
            where: {spotId, userId: user.id},
            attributes: ['spotId', 'startDate', 'endDate']
        })

        for (let booking of preBookings){
            booking = objFormatter(booking);

            Bookings.push(booking);
        }
   }

   res.json({Bookings});

});

router.post('/:spotId/bookings', [requireAuth, ifExists, bookingValidator, bookingConflicts], async (req, res) => {
    const { user } = req;
    const { spotId } = req.params;
    let { startDate, endDate } = req.body;
    const spot = await Spot.findByPk(spotId);

    if(user.id === spot['ownerId']){
        return res.status(403).json(
            {
                "message": "Forbidden"
              }
        )
    };

    let newBooking = await Booking.create({
        userId: user.id,
        spotId: +spotId,
        startDate,
        endDate
    });

    newBooking = objFormatter(newBooking)

    res.json(newBooking)
})

module.exports = router;
