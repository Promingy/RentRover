const express = require('express');
const { check } = require('express-validator');

const { requireAuth, authorize } = require('../../utils/auth');
const { ifExists, handleValidationErrorsNoTitle, objFormatter } = require('../../utils/validation');
const { User, Review, Spot, ReviewImage, SpotImage } = require('../../db/models')

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
        },
        order: [[ReviewImage, 'id']]
    });

    const returnReviews = [];

    for (let review of Reviews) {
        review = objFormatter(review);

        const previewImage = await SpotImage.findByPk(review.Spot.id, {
            where: {preview: true},
        })

        // if(previewImage) review.Spot.previewImage = previewImage.url;

        review.Spot.previewImage = previewImage ? previewImage.url : `No preview image available`

        returnReviews.push(review)
    }

    res.json({Reviews: returnReviews})
});

router.post('/:reviewId/images', [requireAuth, authorize, ifExists], async (req, res) =>{
    const { url } = req.body;
    const { reviewId } = req.params;
    const reviewImages = await ReviewImage.count({where: {reviewId}})

    if (reviewImages == 10) {
        return res.status(403).json(
            {
            "message": "Maximum number of images for this resource was reached"
          })
    };

    const newReviewImage = await ReviewImage.create({reviewId, url})

    res.json({id: newReviewImage.id, url: newReviewImage.url})
});

router.put('/:reviewId', [requireAuth, authorize, ifExists, validBodyReview], async (req, res) => {
    const { review, stars } = req.body;
    const { reviewId } = req.params;
    let reviewToUpdate = await Review.findByPk(reviewId);

    await reviewToUpdate.update({
        review,
        stars: +stars
    })


    reviewToUpdate = objFormatter(reviewToUpdate);

    res.json(reviewToUpdate)
});

router.delete('/:reviewId', [requireAuth, authorize, ifExists], async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId);

    await review.destroy();

    res.json({
        "message": "Successfully deleted"
      })
});

module.exports = router;
