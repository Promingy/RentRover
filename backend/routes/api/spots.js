const express = require('express')
const bcrypt = require('bcryptjs')
const { check } = require('express-validator')

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, Review, SpotImage, sequelize } = require('../../db/models');


const router = express.Router();

router.get('/', async (req, res) => {
    let Spots = await Spot.findAll();


    const updatedSpots = []

    for (let spot of Spots) {
        const stars = await Review.sum('stars', {
            where: { spotId: spot.id}
        })
        const numOfReviews = await Review.count({
            where: { spotId: spot.id}
        })

        let url = await SpotImage.findOne({
            attributes: ['url'], where: {spotId: spot.id}
        });


        avgRating = stars / numOfReviews

        spot = spot.toJSON()
        url = url.toJSON()

        spot.avgRating = avgRating
        spot.previewImage = url.url

        updatedSpots.push(spot)
        // spot.dataValues.avgRating = avgRating
        // spot.dataValues.previewImage = url.dataValues.url
    }



    return res.json({Spots: updatedSpots})
})

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
        res.json(
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
})

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const spots = await Spot.findAll({
        where: {
            ownerId: user.id
        }
    })

    res.json(spots)
})

module.exports = router;
