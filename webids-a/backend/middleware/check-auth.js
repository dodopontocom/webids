const { response } = require("express");
const jwt = require("jsonwebtoken");

const path = require("path");

require('dotenv').config({
  path: __dirname + '/.env'
});


module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_USER_PASS_LONG_SECRET);
    req.userData = {email: decodedToken.email, userId: decodedToken.userId};
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed" });
  }
};
