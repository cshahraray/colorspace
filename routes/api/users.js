const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const keys = require('../../config/keys');
const User = require('../../models/User');
const validateLoginInput = require("../../validation/login");
const validateSignupInput = require("../../validation/signup");

const router = express.Router();
//auth route
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email
    });
  })

//signup
router.post("/signup", (req, res) => {
    const { errors, isValid } = validateSignupInput(req.body);
  
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
    User.findOne({ username: req.body.username }).then(user => {
      if (user) {
        errors.username = "User already exists";
        return res.status(400).json(errors);
      } else {
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password
        });
  
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                const payload = { id: user.id, username: user.username };
  
                jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token
                  });
                });
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  });


  //login

  router.post("/login", (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    console.log(req.body)

    if (!isValid) {
      return res.status(400).json(errors);
    }
    const username = req.body.username;
    const password = req.body.password;
  
    User.findOne({ username }).then(user => {
      if (!user) {
        errors.username = "This user does not exist";
        return res.status(400).json(errors);
      }
  
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = { id: user.id, username: user.username };
  
          jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          });
        } else {
          errors.password = "Incorrect password";
          return res.status(400).json(errors);
        }
      });
    });
  });


router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

module.exports = router;    