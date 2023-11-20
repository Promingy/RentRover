
const GET_SPOT_REVIEWS = 'reviewsReducer/GET_SPOT_REVIEWS'


/// action creators
const actionGetReviewsForSpot = (reviews) => {
    return {
        type: GET_SPOT_REVIEWS,
        reviews
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

/// reducer

const initialState = {}

const reviewsReducer = (state = initialState, action) =>{
    switch (action.type) {
        case GET_SPOT_REVIEWS: {
            return { ...state, ...action.reviews}
        }
        default:
            return state
    }

}

export default reviewsReducer
