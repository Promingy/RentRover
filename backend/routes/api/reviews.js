const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { check } = require('express-validator');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { handleValidationErrors } = require('../../utils/validation');
const { User, Review, Spot, ReviewImage, SpotImage, Sequelize } = require('../../db/models')

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const Reviews = await Review.findAll({
        include: [
            {model: User, attributes: ['id', 'firstName', 'lastName']},
            {model: Spot, attributes: {exclude: ['createdAt', 'updatedAt', 'description']}},
            {model: ReviewImage, attributes: ['id', 'url']}],
        where: {
            userId: user.id
        }
    });

    for (let review of Reviews) {
        const previewImage = await SpotImage.findByPk(review.Spot.id, {
            where: {preview: true}
        })

        review.Spot.dataValues.previewImage = previewImage.dataValues.url
    }

    res.json({Reviews})
})

router.post('/:reviewId/images', requireAuth, async (req, res) =>{
    const { user } = req;
    const { url } = req.body;
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);
    const reviewImages = await ReviewImage.count({where: {reviewId}})

    if (!review) {
        res.status(404).json(
            {
            "message": "Review couldn't be found"
          })
    }

    if (reviewImages == 10) {
        res.status(403).json(
            {
            "message": "Maximum number of images for this resource was reached"
          })
    }

    if (user.id !== review['userId']){
        return res.status(403).json(
            {
            "message": "Forbidden"
          })
    }

    const newReviewImage = await ReviewImage.create({reviewId, url})

    res.json({id: newReviewImage.id, url: newReviewImage.url})
})

router.get

module.exports = router;
