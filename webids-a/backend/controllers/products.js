const Product = require('../models/product');

exports.createProduct = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userId
    });
    product.save().then(createdProduct => {
      console.log(createdProduct);
      res.status(201).json({
        message: 'Post added successfully',
        product: {
          ...createdProduct,
          id: createdProduct._id
        }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: "Creating product failed"
    });
  });
};

exports.updateProduct = (req, res, next) => {
  console.log(req.file);
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const product = new Product({
    _id: req.body.id,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imagePath: imagePath,
    creator: req.userData.userId
  });

  Product.updateOne({_id: req.params.id, creator: req.userData.userId}, product)
    .then(result => {
      if(result.n > 0) {
        res.status(200).json({ message: "Update successful"});
      } else {
        res.status(401).json({ message: "Not authorized"});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Could not update product"
      });
    });
  };

  exports.getProducts = (req, res, next) => {
    const pageSize = +req.query.pagesize; // + sign convert to numbers
    const currentPage = +req.query.page;
    const productQuery = Product.find();
    let fetchedProducts;

    if (pageSize && currentPage) {
      productQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    productQuery.find()
      .then(documents => {
        fetchedProducts = documents;
        console.log(documents)
        return Product.count();

      })
      .then(count => {
        res.status(200).json({
          message: "Products fetched successfully",
          products: fetchedProducts,
          maxProducts: count
        });
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching Products failed"
        });
      });
  };

  exports.getProduct = (req, res, next) => {
    Product.findById(req.params.id).then(product => {
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({message: "Product no found"});
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching Product failed"
      });
    });
  };

exports.deleteProduct = (req, res, next) => {
  Product.deleteOne({_id: req.params.id, creator: req.userData.userId})
  .then(result => {
    if(result.n > 0) {
      res.status(200).json({ message: 'Product Deleted' });
    } else {
      res.status(401).json({ message: 'Not Authorized' });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Deleting Products failed"
    });
  });
};
