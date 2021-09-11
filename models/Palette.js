const mongoose = require("mongoose");

const PaletteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },

    title: {
        type: String,
        required: true
      },
    
    primaryHue: {
        type: Number,
        required: true
    },

    complement: {
        type: Boolean,
        required: true
    },

    numHarmonies: {
        type: Number,
        required: true,

    },

    harmonies: {
        type: Array,
        required: false
    },

    shadesLightness: {
        type: Array,
        required: true
    },

    shadesSaturation: {
        type: Array,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }

})


module.exports = Palette = mongoose.model('Palette', PaletteSchema); 