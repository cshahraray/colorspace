const validHue = require("./valid-hue");


const validHarmonies = (array) => {
    if(!Array.isArray(array)) {
        return false;
    }
    let i = 0;
    while (validHue(parseInt(array[i])) && i < array.length) {
        i ++;
    }

    return i === array.length;
  }

  module.exports = validHarmonies;