import { csrfFetch } from "./csrf"


const GET_SPOTS = 'spotsRecuder/GET_SPOTS';
const GET_SINGLE_SPOT = 'spotsRecude/GET_SINGLE_SPOT'

/// ACTION CREATORS
const actionGetSpots = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
}

const actionGetSingleSpot = (spot) => {
    return {
        type: GET_SINGLE_SPOT,
        spot
    }
}

/// THUNKTIONS
export const thunkGetAllSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots');

    if (res.ok){
        const data = await res.json();
        dispatch(actionGetSpots(data.Spots))
    }
}

export const thunkGetSingleSpot = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}`)

    if (res.ok){
        const data = await res.json();
        dispatch(actionGetSingleSpot(data))
        return res
    }
}

/// SELECTORS
//! VERIFY WITH DAN BEFORE USING INCASE 'RESELECT' ISN'T APPROVED

const initialState = {}

const spotsReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_SPOTS: {
            return {...state, Spots: [null, ...action.spots]}
        }
        case GET_SINGLE_SPOT:{
            const newState = {...state}
            newState.Spots = {...state.Spots, [action.spot.id]: action.spot}
            return newState
        }
        default:
            return state
    }
}

export default spotsReducer
