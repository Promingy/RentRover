const { validationResult } = require('express-validator');
const { User, Spot, Review, Booking, ReviewImage, SpotImage } = require('../db/models');


// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const handleValidationErrorsNoTitle = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    next(err);
  }
  next();
};

const handleBookings = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Sorry, this spot is already booked for the specified dates");
    err.errors = errors;
    err.status = 403;
    next(err);
  }
  next()
};

const handleQueries = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad Request");
    err.errors = errors;
    err.status = 400;
    next(err);
  }
  next()
};

const ifExists = async (req, res, next) => {
  const { user } = req;
  const { spotId, reviewId, bookingId, reviewImageId, spotImageId } = req.params;

  if (spotId) {
    const spot = await Spot.findByPk(spotId);

    return spot ? next() : res.status(404).json({ message: `Spot could not be found`})
  }

  if (reviewId) {
      const review = await Review.findByPk(reviewId);

      return review ? next() : res.status(404).json({ message: `Review could not be found`})
  }

  if (bookingId) {
      const booking = await Booking.findByPk(bookingId);

      return booking ? next() : res.status(404).json({ message: `Booking could not be found`})
  }

  if(reviewImageId){
    const reviewImage = await ReviewImage.findByPk(reviewImageId)

    return reviewImage ? next() : res.status(404).json({ message: `Review Image could not be found`})
  }

  if(spotImageId) {
    const spotImage = await SpotImage.findByPk(spotImageId);

    return spotImage ? next() : res.status(404).json({ message: `Spot Image could not be found`})
  }

  return next();
};

function objFormatter(obj){
  obj = obj.toJSON();

  if(obj.createdAt !== undefined) {
      obj.createdAt = obj.createdAt.toLocaleString().split('/').join('-');
      obj.updatedAt = obj.updatedAt.toLocaleString().split('/').join('-');
  }

  if(obj.price !== undefined) obj.price = +obj.price;
  if(obj.lat !== undefined) obj.lat = +obj.lat;
  if(obj.lng !== undefined) obj.lng = +obj.lng;

  if(obj.startDate !== undefined){
      obj.startDate = obj.startDate.toLocaleString().split('/').join('-').slice(0, 10);
  }

  if(obj.endDate !== undefined){
      obj.endDate = obj.endDate.toLocaleString().split('/').join('-').slice(0, 10);
  }

  if(obj.Spot !== undefined){
    if(obj.Spot.lat !== undefined) obj.Spot.lat = +obj.Spot.lat
    if(obj.Spot.lng !== undefined) obj.Spot.lng = +obj.Spot.lng
    if(obj.Spot.price !== undefined) obj.Spot.price = +obj.Spot.price

  }

  return obj
}

module.exports = {
  handleValidationErrors,
  handleBookings,
  handleValidationErrorsNoTitle,
  handleQueries,
  ifExists,
  objFormatter
};
