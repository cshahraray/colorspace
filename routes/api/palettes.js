const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Palette = require('../../models/Palette');
const validatePaletteInput = require('../../validation/palettes');


router.get("/test", (req, res) => res.json({ msg: "This is the palettes route" }));

module.exports = router;