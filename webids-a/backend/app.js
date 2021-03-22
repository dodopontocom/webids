const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Request-With",
    "Content-Type, Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.use('/api/products', (req, res, next) => {
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
