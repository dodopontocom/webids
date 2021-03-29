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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.post("/api/v1/products", (req, res, next) => {
  const product = new Product({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price
  });
  product.save().then(cretedProduct => {
    console.log(cretedProduct);
    res.status(201).json({
      message: 'Post added successfully',
      productId: cretedProduct._id
    });
  });
});

app.put('/api/v1/products/:id', (req, res, next) => {
  const product = new Product({
    _id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price
  });
  Product.updateOne({_id: req.params.id}, product).then(result => {
    console.log(result);
    res.status(200).json({ message: "Update successful"});
  })
});

app.get('/api/v1/products', (req, res, next) => {
  Product.find()
    .then(documents => {
      res.status(200).json({
        message: 'Products fetched successfully',
        products: documents
      });
      console.log(documents)
    });
});

app.delete('/api/v1/products/:id', (req, res, next) => {
  Product.deleteOne({_id: req.params.id}).then(result => {
    console.log(result)
    res.status(200).json({ message: 'Product Deleted' });
  });
  console.log(req.params.id);
});

module.exports = app;
