import { 
    getAllPalettes, 
    getUserPalettes, 
    savePalette,
    deletePalette
} from "../util/palettes_api_util";

//action constants
export const RECEIVE_ALL_PALETTES = "RECEIVE_ALL_PALETTES";
export const RECEIVE_PALETTE = "RECIVE_PALETTE"
export const RECEIVE_USER_PALETTES = "RECEIVE_USER_PALETTES"
export const RECEIVE_NEW_PALETTE = "RECEIVE_NEW_PALETTE"
export const REMOVE_PALETTE = "REMOVE_PALETTE"

//action creators
export const receiveAllPalettes = palettes => ({
    type: RECEIVE_ALL_PALETTES,
    palettes
  });

export const receiveUserPalettes = palettes => ({
    type: RECEIVE_USER_PALETTES,
    palettes
});

export const receiveNewPalette = palette => ({
    type: RECEIVE_NEW_PALETTE,
    palette
  })

export const removePalette = paletteID => ({
    type: REMOVE_PALETTE,
    paletteID
})

//thunk actions
export const fetchAllPalettes = () => dispatch => (
    getAllPalettes()
        .then(palettes => dispatch(receiveAllPalettes(palettes)))
        .catch(err => console.log(err))
);

export const fetchUserPalettes = userID => dispatch => (
    getUserPalettes(userID)
        .then(palettes => dispatch(receiveUserPalettes(palettes)))
        .catch(err => console.log(err))
);

export const createPalette = data => dispatch => (
    savePalette(data)
      .then(palette => dispatch(receiveNewPalette(palette)))
      .catch(err => console.log(err))
);

export const destroyPalette = paletteID => dispatch => (
   deletePalette(paletteID)
    .then( palette => removePalette(palette._id))
    .catch( err => console.log(err))
)