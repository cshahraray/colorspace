import axios from 'axios';

export const getAllPalettes = () => {
  return axios.get('/api/palettes/')
};

export const getUserPalettes = userID => {
  return axios.get(`/api/palettes/user/${userID}`)
};

export const getPaletteByID = paletteID => {
    return axios.get(`api/palettes/${paletteID}`)
};

export const savePalette = data => {
  return axios.post('/api/palettes/', data)
}

export const deletePalette = paletteID => {
    return axios.delete(`/api/palettes/${paletteID}`)
}