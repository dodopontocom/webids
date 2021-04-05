const { response } = require("express");
const jwt = require("jsonwebtoken");

const path = require("path");

require('dotenv').config({
  path: __dirname + '/.env'
});


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_USER_PASS_LONG_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
};
