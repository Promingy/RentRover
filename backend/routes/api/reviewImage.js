const express = require('express');

const { requireAuth, authorize } = require('../../utils/auth');
const { ifExists } = require('../../utils/validation');
const { ReviewImage } = require('../../db/models');

const router = express.Router();

router.delete('/:reviewImageId', [requireAuth, authorize, ifExists], async (req, res) => {
    const { reviewImageId } = req.params;
    const reviewImage = await ReviewImage.findByPk(reviewImageId);

    await reviewImage.destroy();

    res.json({ message: "Successfully deleted"});
})

module.exports = router;
