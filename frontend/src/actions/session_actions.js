import * as APIUtil from '../util/session_api_util';
import jwt_decode from 'jwt-decode';


//action constants
export const LOGOUT_USER = "LOGOUT_USER";
export const RECEIVE_CURRENT_USER = "RECEIVE_CURRENT_USER";
export const RECEIVE_SESSION_ERRORS = "RECEIVE_SESSION_ERRORS";
export const SIGN_IN_USER = "SIGN_IN_USER"


//action creators
    //logs user out
export const logoutUser = () => ({
    type: LOGOUT_USER
});

    //dispatched when logged-in
export const receiveCurrentUser = currentUser => ({
    type: RECEIVE_CURRENT_USER,
    currentUser
});
    //will redirect user to login when signed in 
export const receiveUserSignIn = () => ({
    type: SIGN_IN_USER
});
    //show auth errors on frontend
export const receiveErrors = errors => ({
    type: RECEIVE_SESSION_ERRORS,
    errors
});


export const logout = () => dispatch => {
    // Remove authtoken from local storage
    localStorage.removeItem('jwtToken')
    // Remove authtoken from the common axios header
    APIUtil.setAuthToken(false)
    // Dispatch a logout action
    dispatch(logoutUser())
};

export const login = user => dispatch => (
    APIUtil.login(user).then(res => {
        const { token } = res.data;
        localStorage.setItem('jwtToken', token);
        APIUtil.setAuthToken(token);
        const decoded = jwt_decode(token);
        dispatch(receiveCurrentUser(decoded))
    })
    .catch(err => {
        dispatch(receiveErrors(err.response.data));
    })
)

export const signup = user => dispatch => (
    APIUtil.signup(user).then(() => (
        dispatch(receiveUserSignIn())
    ), err => (
        dispatch(receiveErrors(err.response.data))
    ))
);