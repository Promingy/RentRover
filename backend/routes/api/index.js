const router = require('express').Router();
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models')

// Connect restoreUser middleware to the API router
    // If current user session is valid, set req.user to the user in the database
    // If current user session is not valid, set req.user to null

router.use(restoreUser);


module.exports = router;
