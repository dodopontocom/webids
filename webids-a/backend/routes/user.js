const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require('dotenv').config({
  path: __dirname + '/.env'
});

const User = require("../models/user");
const { response } = require("express");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User ({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash,
        createdAt: new Date().toISOString()
    });
    user.save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "User created",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

// router.put("/login", (req, res, next) => {
//   console.log("rodolfo=========>");
// });

router.post("/login", (req, res, next) => {
  console.log(req.params);
  let fetchedUser;
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (!user){
      return res.status(401).json({
        message: "Auth Failed"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result) {
      return res.status(401).json({
        message: "Auth Failed"
      });
    }
    const token = jwt.sign({
      email: fetchedUser.email, userId: fetchedUser._id },
      process.env.JWT_USER_PASS_LONG_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });

  })
  .catch (err => {
    console.log(err);
    return res.status(401).json({
      message: "Auth Failed"
    });
  });
});

module.exports = router;
