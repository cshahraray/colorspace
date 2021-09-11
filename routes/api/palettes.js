const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Palette = require('../../models/Palette');
const validatePaletteInput = require('../../validation/palettes');


router.get("/test", (req, res) => res.json({ msg: "This is the palettes route" }));

//backend api INDEX ROUTE for all palettes /api/palettes
router.get('/', (req, res) => {
    Palette.find()
        .sort({ date: -1 })
        .then(palette => res.json(palette))
        .catch(err => res.status(404).json({ nopalettesfound: 'No palettes found :(' }));
});

//backend api USER SHOW ROUTE for all palettes by user /api/palettes/user/:user_id
router.get('/user/:user_id', (req, res) => {
    Palette.find({user: req.params.user_id})
        .then(palettes => res.json(palettes))
        .catch(err =>
            res.status(404).json({ nopalettesfound : 'No palettes found from that user' }
        )
    );
});


//backend api POST ROUTE /api/palettes/
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
        shadesSaturation: req.body.shadesSaturation,
        complement: req.body.complement
      });
  
      newPalette.save().then(tweet => res.json(tweet));
    }
  );
module.exports = router;