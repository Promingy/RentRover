const express = require('express');

const { requireAuth, authorize } = require('../../utils/auth');
const { ifExists } = require('../../utils/validation');
const { SpotImage } = require('../../db/models');

const router = express.Router();

router.delete('/:spotImageId', [requireAuth, authorize, ifExists], async (req, res) => {
    const { spotImageId } = req.params;
    const spotImage = await SpotImage.findByPk(spotImageId);

    await spotImage.destroy();

    res.json({ message: 'Successfully deleted'})
})

module.exports = router;
