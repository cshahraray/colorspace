import { combineReducers } from 'redux';
import session from './session_reducer';
import errors from './errors_reducer';
import palettes from './palettes_reducer'

const RootReducer = combineReducers({
  session,
  palettes,
  errors
});

export default RootReducer;