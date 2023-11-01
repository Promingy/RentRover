const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { check } = require('express-validator');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { handleValidationErrors, handleValidationErrorsNoTitle } = require('../../utils/validation');
const { User, Review, Spot, ReviewImage, SpotImage, Sequelize } = require('../../db/models')

const router = express.Router();

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
];

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
});

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
    };

    if (user.id !== review['userId']){
        return res.status(403).json(
            {
            "message": "Forbidden"
          })
    };

    if (reviewImages == 10) {
        return res.status(403).json(
            {
            "message": "Maximum number of images for this resource was reached"
          })
    };


    const newReviewImage = await ReviewImage.create({reviewId, url})

    res.json({id: newReviewImage.id, url: newReviewImage.url})
});

router.put('/:reviewId', [requireAuth, validBodyReview], async (req, res) => {
    const { user } = req;
    const { review, stars } = req.body;
    const { reviewId } = req.params;
    const reviewToUpdate = await Review.findByPk(reviewId);

    if (!reviewToUpdate) {
        return res.status(404).json(
            {
            "message": "Review couldn't be found"
          })
    }

    if (reviewToUpdate['userId'] !== user.id) {
        return res.status(403).json(
            {
            "message": "Forbidden"
          })
    }

    await reviewToUpdate.update({
        review,
        stars
    }).catch(err => res.status(400).json(err))

    res.json(reviewToUpdate)
});

router.delete('/:reviewId', requireAuth, async (req, res) => {
    const { user } = req;
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);

    if(!review) {
        return res.status(404).json(
            {
            "message": "Review couldn't be found"
          })
    }

    if(user.id !== review['userId']){
        return res.status(403).json(
            {
                "message": "Forbidden"
              }
        )
    }

    await review.destroy();

    res.json({
        "message": "Successfully deleted"
      })

});

module.exports = router;
