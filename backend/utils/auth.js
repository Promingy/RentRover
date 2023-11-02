const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Spot, Review, Booking, ReviewImage, SpotImage } = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username
    };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );

    const isProduction = process.env.NODE_ENV === "production";

    // set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, //maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token
}

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
                attributes: {
                    include: ['email', 'createdAt', 'updatedAt']
                }
            });
        } catch (e) {
            res.clearCookie('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');

        return next();
    });
};

const requireAuth = function (req, _res, next) {
    if (req.user) return next();

    const err = new Error('Authentication required');
    if (process.env.NODE_ENV !== "production"){
        err.title = 'Authentication required';
        err.errors = { message: 'Authentication required' };
    }
    err.status = 401;
    return next(err);
};

const authorize = async function (req, _res, next) {
    const { user } = req;
    const { spotId, reviewId, bookingId, reviewImageId, spotImageId } = req.params;

    if (spotId) {
        const spot = await Spot.findByPk(spotId);
        if (!spot || user.id === spot['ownerId']) return next();
    }

    if (reviewId) {
        const review = await Review.findByPk(reviewId);
        if(!review || user.id === review['userId']) return next();
    }

    if (bookingId) {
        const booking = await Booking.findByPk(bookingId);
        if(!booking || user.id === booking['userId']) return next();
    }

    if(reviewImageId){
        const reviewImage = await ReviewImage.findByPk(reviewImageId);

        if (!reviewImage) return next();

        const review = await Review.findByPk(reviewImage['reviewId'])

        if(user.id === review['userId']) return next()

    }
    if(spotImageId){
        const spotImage = await SpotImage.findByPk(spotImageId);

        if (!spotImage) return next();

        const spot = await Spot.findByPk(spotImage['spotId'])

        if(user.id === spot['userId']) return next()

    }

    const err = new Error('Forbidden');
    if (process.env.NODE_ENV !== "production"){
        err.title = 'Authentication required';
        err.errors = { message: 'Authentication required' };
    }
    err.status = 403;
    return next(err);
};

module.exports = { setTokenCookie, restoreUser, requireAuth, authorize };
