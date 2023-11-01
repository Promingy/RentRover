const express = require('express');
const { check } = require('express-validator');

const { requireAuth } = require('../../utils/auth');
const { handleValidationErrorsNoTitle } = require('../../utils/validation');
const { ReviewImage, Review, User } = require('../../db/models');

const router = express.Router();

router.delete('/:reviewImageId', requireAuth, async (req, res) => {
    const { user } = req;
    const { reviewImageId } = req.params;
    const reviewImage = await ReviewImage.findByPk(reviewImageId);

    if (!reviewImage) {
        res.status(404).json({
            "message": "Review Image couldn't be found"
        })
    }

    const review = await Review.findByPk(reviewImage['reviewId']);

    if(review['userId'] !== user.id){
        res.status(403).json({
            message: "Forbidden"
        })
    };

    await reviewImage.destroy();

    res.json({ message: "Successfully deleted"});
})

module.exports = router;
