// backend/routes/productRoutes.js

import express from 'express';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Fetch all products (with Search)
// @route   GET /api/products
// @access  Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};
    const products = await Product.find({ ...keyword });
    res.json(products);
  })
);

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

// --- NEW ADMIN ROUTES BELOW ---

// @desc    Create a product (Creates a blank template)
// @route   POST /api/products
// @access  Private/Admin
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized as an Admin');
    }

    // Creates a "draft" product that you can immediately edit
    const product = new Product({
      name: 'Sample Product Name',
      price: 0,
      user: req.user._id,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600',
      brand: 'Nexa',
      category: 'Sample Category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample description for this new product.',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  })
);

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized as an Admin');
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(product._id);
      res.json({ message: 'Product removed successfully' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized as an Admin');
    }

    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private (Must be logged in)
router.post(
  '/:id/reviews',
  protect,
  asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if this specific user already reviewed this product
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error('You have already reviewed this product');
      }

      // Create the new review
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      // Add to database
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      
      // Calculate the new overall average rating
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added successfully' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  })
);

export default router;