import { LOGOUT_USER, RECEIVE_CURRENT_USER, SIGN_IN_USER } from '../actions/session_actions';

const initialState = {
    isAuthenticated: false,
    user: {}
};

export default function sessionReducer (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !!action.currentUser,
        user: action.currentUser
      };
    case SIGN_IN_USER: 
      return {
        ...state,
        isSignedIn: true
      }
    case LOGOUT_USER:
      return {
        isAuthenticated: false,
        user: undefined
      };
    default:
      return state;
  }
}