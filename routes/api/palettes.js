const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Palette = require('../../models/Palette');
const validatePaletteInput = require('../../validation/palettes');


router.get("/test", (req, res) => res.json({ msg: "This is the palettes route" }));

router.post('/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      req.body.shadesSaturation = req.body.shadesSaturation.split(', ')
      req.body.shadesLightness = req.body.shadesLightness.split(', ')
      req.body.harmonies = req.body.harmonies.split(', ')
      
      const { errors, isValid } = validatePaletteInput(req.body);
      console.log(req.body.shadesSaturation)
      if (!isValid) {
        return res.status(400).json(errors);
      }
  
      const newPalette = new Palette({
        user: req.user.id,
        title: req.body.title,
        primaryHue: req.body.primaryHue,
        numHarmonies: req.body.numHarmonies,
        harmonies: req.body.harmonies,
        shadesLightness: req.body.shadesLightness,
        shadesSaturation: req.body.shadesSaturation
      });
  
      newPalette.save().then(tweet => res.json(tweet));
    }
  );
module.exports = router;