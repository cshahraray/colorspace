const validLightnessSat = require("./valid-lightness-sat")

const validLightnessSatArray = array => {
    let check = Array.isArray(array) && array.length === 5
    if (!check) {
        return check;
    }
    let i = 0

    while (validLightnessSat(array[i]) && i < 5) {
        i++;
    }

    return i === 5 ? true : false;
  }

  module.exports = validLightnessSatArray;