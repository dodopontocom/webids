const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRoutes = require('./routes/products');
const userRoutes = require('./routes/user');

require('dotenv').config({
  path: __dirname + '/.env'
});

const app = express();

mongoose.connect(process.env.MONGO_ATLAS_STRING)
  .then(() => {
    console.log('Connected to the database')
  })
  .catch(() => {
    console.log('Connection failed')
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/v1/products", productsRoutes);
app.use("/api/v1/user", userRoutes);

module.exports = app;
