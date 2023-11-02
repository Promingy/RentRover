const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { Op } = require('sequelize');


const { handleValidationErrors, handleBookings, handleValidationErrorsNoTitle, handleQueries } = require('../../utils/validation');
const { setTokenCookie, requireAuth, authorize } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, ReviewImage, Booking, Sequelize,  } = require('../../db/models');


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
        .custom((value, {req}) => {
            const { page } = req.query;

            return page && page < 1 ? false : true

        })
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .custom((value, {req}) => {
            const { size } = req.query;
            return size && size < 1 ? false : true

            if (size < 1) return false
        })
        .withMessage('Size must be greater than or equal to 1'),
    check('maxLat')
        .custom((value, {req}) => {
            const { maxLat, minLat } = req.query;

            return maxLat && maxLat > 90 || minLat > maxLat ? false : true

            if (maxLat > 90) return false
        })
        .withMessage('Maximum latitude cannot be greater than 90'),
    check('minLat')
        .custom((value, {req}) => {
            const { minLat, maxLat } = req.query;

            return minLat && minLat < -90 || minLat > 90 || minLat > maxLat ? false : true

            if (minLat < -90) return false
        })
        .withMessage('Minimum latitude cannot be less than -90'),
    check('minLng')
        .custom((value, {req}) => {
            const { minLng, maxLng } = req.query;

            return minLng && minLng < -180 || minLng > 180 || minLng > maxLng ? false : true

            if (minLng < -180) return false
        })
        .withMessage('Minimum longitude cannot be less than -180'),
    check('maxLng')
        .custom((value, {req}) => {
            const { maxLng, minLng } = req.query;

            return maxLng && maxLng > 180 || +maxLng < +minLng ? false : true

            if (maxLng > 180) return false
        })
        .withMessage('Maximum longitude cannot be greater than 180'),
    check('minPrice')
        .custom((value, {req}) => {
            const { minPrice } = req.query;

            return minPrice && +minPrice < 1 ? false : true

            if (+minPrice < 1) return false
        })
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
        .custom((value, {req}) => {
            const { maxPrice } = req.query;

            return maxPrice && +maxPrice < 1 ? false : true

            if (+maxPrice < 1) return false
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

        const createdAt = spot['createdAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');
        const updatedAt = spot['updatedAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');

        avgRating = stars / numOfReviews

        spot = spot.toJSON()
        if(url) url = url.toJSON()

        spot.avgRating = avgRating
        if(url) spot.previewImage = url.url
        spot.createdAt = createdAt
        spot.updatedAt = updatedAt

        spot.price = +spot.price;
        spot.lat = +spot.lat;
        spot.min = +spot.min;

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

    const createdAt = newSpot['createdAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');
    const updatedAt = newSpot['updatedAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');

    newSpot = newSpot.toJSON();

    newSpot.createdAt = createdAt;
    newSpot.updatedAt = updatedAt;


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

        const createdAt = spot['createdAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');
        const updatedAt = spot['updatedAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');

        spot = spot.toJSON();
        if(url) url = url.toJSON();

        spot.avgRating = avgRating;
        if(url) spot.previewImage = url.url;
        spot.createdAt = createdAt;
        spot.updatedAt = updatedAt;
        spot.price = +spot.price;
        spot.lat = +spot.lat;
        spot.min = +spot.min;

        updatedSpots.push(spot);
    }

    res.json({Spots: updatedSpots})
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

    const createdAt = spot['createdAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');
    const updatedAt = spot['updatedAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');

    spot.createdAt = createdAt;
    spot.updatedAt = updatedAt;
    spot.numReviews = reviews;
    spot.avgRating = avgRating;
    spot.Owner = Owner;
    spot.price = +spot.price;
    spot.lat = +spot.lat;
    spot.min = +spot.min;

    res.json(spot);
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
        return res.status(403).json(
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

    const returnReviews = [];

    for (let review of Reviews) {
        const createdAt = review['createdAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');
        const updatedAt = review['updatedAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');

        review = review.toJSON();

        review.createdAt = createdAt
        review.updatedAt = updatedAt

        returnReviews.push(review)
    }

    res.json({Reviews: returnReviews})
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

    let newReview = await Review.create({
        userId: user.id,
        spotId,
        review,
        stars
    })

    newReview = newReview.toJSON();

    const createdAt = newReview['createdAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');
    const updatedAt = newReview['updatedAt'].toISOString().split('T').join(' ').replace(/\..+/g, '')

    newReview.createdAt = createdAt;
    newReview.updatedAt = updatedAt;

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
        return res.status(403).json(
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

    spot = spot.toJSON();

    const createdAt = spot['createdAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');
    const updatedAt = spot['updatedAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');

    spot.createdAt = createdAt;
    spot.updatedAt = updatedAt;

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
        return res.status(403).json(
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

   let Bookings = [];

   if (spot['ownerId'] === user.id) {
        let preBookings = await Booking.findAll({
            include: {model: User, attributes: ['id', 'firstName', 'lastName']},
            where: {spotId}
        })

        for (let booking of preBookings) {
            booking = booking.toJSON();

            const createdAt = booking['createdAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');
            const updatedAt = booking['updatedAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');
            const startDate = booking['startDate'].toISOString().split('T').join(' ').replace(/\..+/g, '');
            const endDate = booking['endDate'].toISOString().split('T').join(' ').replace(/\..+/g, '');

            booking.startDate = startDate;
            booking.endDate = endDate;
            booking.createdAt = createdAt
            booking.updatedAt = updatedAt

            Bookings.push(booking)
        }
   } else {
        let preBookings = await Booking.findAll({
            where: {spotId, userId: user.id},
            attributes: ['spotId', 'startDate', 'endDate']
        })

        for (let booking of preBookings){
            booking = booking.toJSON();

            const startDate = booking['startDate'].toISOString().split('T').join(' ').replace(/\..+/g, '');
            const endDate = booking['endDate'].toISOString().split('T').join(' ').replace(/\..+/g, '');

            booking.startDate = startDate;
            booking.endDate = endDate;

            Bookings.push(booking)
        }
   }

   res.json({Bookings});

});

router.post('/:spotId/bookings', [requireAuth, bookingValidator, bookingConflicts], async (req, res) => {
    const { user } = req;
    const { spotId } = req.params;
    let { startDate, endDate } = req.body;
    const spot = await Spot.findByPk(spotId);

    if(!spot){
        return res.status(404).json(
            {
                "message": "Spot couldn't be found"
              }
        )
    };

    //! may need to be updated. This disallows owner to book on their own spot
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

    newBooking = newBooking.toJSON();

    const createdAt = newBooking['createdAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');
    const updatedAt = newBooking['updatedAt'].toISOString().split('T').join(' ').replace(/\..+/g, '');
    startDate = newBooking['startDate'].toISOString().split('T').join(' ').replace(/\..+/g, '')
    endDate = newBooking['endDate'].toISOString().split('T').join(' ').replace(/\..+/g, '');

    newBooking.startDate = startDate.slice(0, 10);
    newBooking.endDate = endDate.slice(0, 10);
    newBooking.createdAt = createdAt;
    newBooking.updatedAt = updatedAt;

    res.json(newBooking)
})

module.exports = router;
