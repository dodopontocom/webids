const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Product = require('./models/product');

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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Content-Type"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post("/api/products", (req, res, next) => {
  const product = new Product({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price
  });
  product.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get('/api/products', (req, res, next) => {
  Product.find()
    .then(documents => {
      res.status(200).json({
        message: 'Products fetched successfully',
        products: documents
      });
      console.log(documents)
    });
});

module.exports = app;
