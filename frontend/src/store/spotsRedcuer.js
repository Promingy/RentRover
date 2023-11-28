import { csrfFetch } from "./csrf";

const GET_SPOTS = 'spotsRecuder/GET_SPOTS';
const GET_SINGLE_SPOT = 'spotsReducer/GET_SINGLE_SPOT';
const CREATE_SPOT = 'spotsReducer/CREATE_SPOT';
const ADD_SPOT_IMAGE = 'spotsReducer/ADD_SPOT_IMAGE';
const CURRENT_USER_SPOTS = 'spotsReducer/CURRENT_USER_SPOTS'
const UPDATE_SPOT = 'spotsReducer/UPDATE_SPOT'
const DELETE_SPOT = 'spotsReducer/DELETE_SPOT'


/// ACTION CREATORS
const actionGetSpots = (spots) => {
    return {
        type: GET_SPOTS,
        spots
    }
}

const actionGetCurrentUserSpots = (spots) => {
    return {
        type: CURRENT_USER_SPOTS,
        spots
    }
}

export const actionGetSingleSpot = (spot) => {
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

const actionAddSpotImage = (image, spotId) => {
    return {
        type: ADD_SPOT_IMAGE,
        image,
        spotId
    }
}

const actionUpdateSpot = (spot, spotId) => {
    return {
        type: UPDATE_SPOT,
        spot,
        spotId
    }
}

const actionDeleteSpot = (spotId) => {
    return {
        type: DELETE_SPOT,
        spotId
    }
}


/// THUNKTIONS
export const thunkGetAllSpots = (query) => async (dispatch) => {
    const res = await fetch(`/api/spots?${query}`);

    if (res.ok){
        const data = await res.json();
        dispatch(actionGetSpots(data.Spots))
    }
}

export const thunkGetCurrentUserSpots = () => async (dispatch) =>{
    const res = await fetch('/api/spots/current')

    if (res.ok) {
        const data = await res.json();
        dispatch(actionGetCurrentUserSpots(data.Spots))
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
    const res = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(spot.Spot)
    });

    if (res.ok) {
        const data = await res.json();
        await dispatch(actionCreateSpot(data))
        dispatch(thunkAddSpotImage(spot.Images, data.id))
        return data
    }
}

export const thunkAddSpotImage = (images, spotId) => async (dispatch) => {
    for (let image of images) {

        if (image) {
            const res = await csrfFetch(`/api/spots/${spotId}/images`, {
                method: 'POST',
                body: JSON.stringify(image)
            })

            if (res.ok) {
                const data = await res.json();
                dispatch(actionAddSpotImage(data, spotId))
            }
        }
    }
}

export const thunkDeleteSpot = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })

    if (res.ok){
        dispatch(actionDeleteSpot(spotId));
    }
}

export const thunkUpdateSpot = (spotId, spot) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        body: JSON.stringify(spot.Spot)
    })

    if (res.ok) {
        const data = await res.json();
        await dispatch(actionUpdateSpot(data, spotId));
        return data
    }
    return res
}


const initialState = {}

const spotsReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_SPOTS: {
            const newState = {...state, Spots: {}};

            action.spots.forEach(spot => {
                newState.Spots[spot.id] = spot
            })

            return newState
        }
        case CURRENT_USER_SPOTS: {
            const newState = {...state, userSpots: {}};

            action.spots.forEach(spot => {
                newState.userSpots[spot.id] = spot
            })

            return newState
        }
        case GET_SINGLE_SPOT:{
            const newState = {...state, Spots: {}}

            newState.Spots = {...state.Spots, [action.spot.id]: action.spot}

            return newState
        }
        case CREATE_SPOT: {
            const newState = {...state, Spots: {[action.spot.id]: action.spot}}
            return newState
        }
        case ADD_SPOT_IMAGE: {
            // check if action.image.previewImage is true
            // if true, key into state with state.Spots[action.spotId]
            // if set action.image.url == to spot

            if (action.image.preview) {
                const newState = {...state}

                newState.Spots[action.spotId].previewImage = action.image.url;

                return newState
            }
            return state
        }
        case UPDATE_SPOT: {
            const newState = {...state}

            newState.Spots[action.spotId] = action.spot

            return newState
        }
        case DELETE_SPOT: {
            const newState = {...state, userSpots: state.userSpots}

            delete newState.userSpots[action.spotId]

            return newState
        }
        default:
            return state
    }
}

export default spotsReducer
