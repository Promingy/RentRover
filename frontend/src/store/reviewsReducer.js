import { json } from "react-router-dom"

const GET_SPOT_REVIEWS = 'reviewsReducer/GET_SPOT_REVIEWS'
const POST_SPOT_REVIEW = 'reviewsReduce/POST_SPOT_REVIEW'

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
    const res = await fetch(`/api/spots/${spotId}/reviews`,{
        method: 'POST',
        body: JSON.stringify(review)
    })

    if (res.ok) {
        const data = await res.json();
        dispatch(actionPostReview(data))
    }
}

/// reducer

const initialState = {}

const reviewsReducer = (state = initialState, action) =>{
    switch (action.type) {
        case GET_SPOT_REVIEWS: {
            return { ...state, ...action.reviews}
        }
        case POST_SPOT_REVIEW: {
            const newReview = {...state}
            console.log(newReview)
            console.log(action.review)
            return
        }
        default:
            return state
    }

}

export default reviewsReducer
