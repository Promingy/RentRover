import { csrfFetch } from "./csrf"

import { thunkGetSingleSpot } from './spotsRedcuer'

const GET_SPOT_REVIEWS = 'reviewsReducer/GET_SPOT_REVIEWS'
const POST_SPOT_REVIEW = 'reviewsReducer/POST_SPOT_REVIEW'
const DELETE_REVIEW = 'reviewsReducer/DELETE_REVIEW'

/// action creators
const actionGetReviewsForSpot = (reviews) => {
    return {
        type: GET_SPOT_REVIEWS,
        reviews
    }
}

const actionPostReview = (review) => {
    return {
        type: POST_SPOT_REVIEW,
        review
    }
}

const actionDeleteReview = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        reviewId
    }
}

/// thunktions
export const thunkGetSpotReviews = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/reviews`)

    if (res.ok){
        const data = await res.json();
        dispatch(actionGetReviewsForSpot(data));
        return res;
    }
}

export const thunkPostReview = (spotId, review) => async (dispatch) => {
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`,{
            method: 'POST',
            body: JSON.stringify(review)
        })

        if (res.ok) {
            const data = await res.json();
            await dispatch(actionPostReview(data))
            dispatch (thunkGetSingleSpot(spotId))
        }
}

export const thunkDeleteReview = (reviewId, spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })

    if (res.ok) {
        await dispatch(actionDeleteReview(reviewId))
        dispatch(thunkGetSingleSpot(spotId))
    }
}

/// reducer

const initialState = {}

const reviewsReducer = (state = initialState, action) =>{
    switch (action.type) {
        case GET_SPOT_REVIEWS: {
            const newState = {...state, Reviews: {}}

            action.reviews.Reviews.map(review => {
                newState.Reviews[review.id] = review
            })

            return newState
        }
        case POST_SPOT_REVIEW: {
            const newState = {...state, Reviews: {}}

            newState.Reviews = {...state.Reviews, [action.review.id]: action.review}

            return newState
        }
        case DELETE_REVIEW: {
            const newState = {...state}

            delete newState.Reviews[action.reviewId]

            return newState
        }
        default:
            return state
    }

}

export default reviewsReducer
