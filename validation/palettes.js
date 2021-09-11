const Validator = require('validator');
const validHarmonies = require('./valid-harmonies');

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
    } else if (validHarmonies(data.Harmonies)) {
        errors.harmonies = 'Invalid harmony values'
    }

    if (!validLightnessSatArray(data.shadesSaturation)) {
        errors.shadesSaturation = 'Invalid shades saturation.'
    }

    if (!validLightnessSatArray(data.shadesLightness)) {
        errors.shadesLightness = 'Invalid shades saturation.'
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
      };
}