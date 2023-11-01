const express = require('express');
const { check } = require('express-validator');

const { requireAuth } = require('../../utils/auth');
const { handleValidationErrorsNoTitle } = require('../../utils/validation');
const { SpotImage, User, Spot } = require('../../db/models');

const router = express.Router();

router.delete('/:spotImageId', requireAuth, async (req, res) => {
    const { user } = req;
    const { spotImageId } = req.params;
    const spotImage = await SpotImage.findByPk(spotImageId);

    if (!spotImage) {
        res.status(404).json(
            {
                "message": "Spot Image couldn't be found"
              }
        )
    }

    const spot = await Spot.findByPk(spotImage['spotId'])

    if (spot['ownerId'] !== user.id) {
        res.status(403).json({ message: 'Forbidden'})
    }

    await spotImage.destroy();

    res.json({ message: 'Successfully deleted'})
})

module.exports = router;