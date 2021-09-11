const Validator = require('validator');

//custom validation methods
const validHue = require("./valid-hue");
const validLightnessSat = require("./valid-lightness-sat");
const validLightnessSatArray = require("./valid-lightness-sat-array");

module.exports = function validatePaletteInput(data) {
    let errors = {};
  
    if (!validHue(data.primaryHue)) {
      errors.primaryHue = 'Valid primary hue required';
    }

    if (!Number.isInteger(data.numHarmonies)) {
        errors.numHarmonies = 'Number of harmonies must be integer'
    }

    



}