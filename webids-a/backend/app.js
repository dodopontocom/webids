const express = require('express');
const bodyParser = require('body-parser');
const app = express();

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
  const product = req.body;
  console.log(product);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get('/api/products', (req, res, next) => {
  const products = [
    {
      id: 'adsoij2',
      title: 'prod1',
      description: 'abc',
      price: '1'
    }
  ];
  res.status(200).json({
    message: 'Products fetched successfully',
    products: products
  });
});

module.exports = app;
