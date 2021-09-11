import React from "react";
import { connect } from "react-redux";
import { createPalette } from "../../../actions/palette_actions";
import PaletteWheel from "./palette_wheel";


const mSTP = (state) => {
    return {
      currentUser: state.session.user,
      newPalette: state.palettes.new
    };
  };

const mDTP = dispatch => {
    return {
        createPalette: data => dispatch(createPalette(data))
    };
};

export default connect(mSTP, mDTP)(PaletteWheel)