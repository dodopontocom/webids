const express = require("express");
const Product = require('../models/product');

const router = express.Router();

router.post("", (req, res, next) => {
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

router.put("/:id", (req, res, next) => {
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

router.get("", (req, res, next) => {
  Product.find()
    .then(documents => {
      res.status(200).json({
        message: 'Products fetched successfully',
        products: documents
      });
      console.log(documents)
    });
});

router.get("/:id", (req, res, next) => {
  Product.findById(req.params.id).then(product => {
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({message: "Product no found"});
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Product.deleteOne({_id: req.params.id}).then(result => {
    console.log(result)
    res.status(200).json({ message: 'Product Deleted' });
  });
  console.log(req.params.id);
});

module.exports = router;
