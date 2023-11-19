import { useNavigate } from "react-router-dom";
import { csrfFetch } from "./csrf";

const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';

/// Action Creators
const actionSetUser = (user) => {
    return {
        type: SET_USER,
        user
    };
};

const actionRemoveUser = () => {
    return {
        type: REMOVE_USER
    }
}

/// Thunktions

export const thunkSignup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const res = await csrfFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({
            username,
            firstName,
            lastName,
            email,
            /// the backend is set up so that it doesn't return the password
            password
        })
    })

    const data = await res.json();
    dispatch(actionSetUser(data.user));
    return res;
}
export const thunkLogin = (user) => async (dispatch) => {
    const { credential, password } = user;

    const res = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password
        })
    })

        const data = await res.json();
        dispatch(actionSetUser(data.user));
        return res;
};

export const thunkLogout = () => async (dispatch) => {
    const res = await csrfFetch('/api/session', {
        method: 'DELETE'
    });

    dispatch(actionRemoveUser());
    return res;
}

export const thunkRestoreUser = () => async (dispatch) => {
    const res = await csrfFetch('/api/session');
    const data = await res.json();
    dispatch(actionSetUser(data.user));
    return res;
}

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_USER:
            return { ...state, user: action.user}
        case REMOVE_USER:
            return { ...state, user: null }
        default:
            return state
    }
}

export default sessionReducer
