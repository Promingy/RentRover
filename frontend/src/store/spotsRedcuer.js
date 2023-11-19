import { csrfFetch } from "./csrf"

const GET_SPOTS = 'spotsRecuder/GET_SPOTS';

/// ACTION CREATORS
const actionGetSpots = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
}

/// THUNKTIONS
export const thunkGetAllSpots = () => async (dispatch) => {
    const res = await fetch('/api/spots');

    if (res.ok){
        const data = await res.json();
        console.log('data', data.Spots)
        dispatch(actionGetSpots(data))
    }
}

const initialState = {}

const spotsReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_SPOTS: {
            return {...state, Spots: action.spots.Spots}
        }
        default:
            return state
    }
}

export default spotsReducer
