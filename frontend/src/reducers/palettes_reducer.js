import { 
    RECEIVE_ALL_PALETTES,
    RECEIVE_USER_PALETTES,
    RECEIVE_NEW_PALETTE

} from "../actions/palette_actions";

const PalettesReducer = (state = { all: {}, user: {}, new: undefined }, action) => {
    Object.freeze(state);
    let newState = Object.assign({}, state);
    switch(action.type) {
      case RECEIVE_ALL_PALETTES:
        newState.all = action.palettes.data;
        return newState;
      case RECEIVE_USER_PALETTES:
        newState.user = action.palettes.data;
        return newState;
      case RECEIVE_NEW_PALETTE:
        newState.new = action.palette.data;
        return newState;
      default:
        return state;
    }
  };
  
  export default PalettesReducer;