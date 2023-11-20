const GET_SPOTS = 'spotsRecuder/GET_SPOTS';
const GET_SINGLE_SPOT = 'spotsReducer/GET_SINGLE_SPOT'
// const GET_SINGLE_SPOT = 'spotsRecude/GET_SINGLE_SPOT'
const CREATE_SPOT = 'spotsReducer/CREATE_SPOT'

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

const actionCreateSpot = (spot) => {
    return {
        type: CREATE_SPOT,
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

export const thunkCreateSpot = (spot) => async (dispatch) => {
    
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
        case CREATE_SPOT: {
            return {...state}
        }
        default:
            return state
    }
}

export default spotsReducer
