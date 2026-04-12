// backend/models/productModel.js

import mongoose from 'mongoose';

// 1. Create a blueprint for individual reviews
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// 2. Attach reviews and rating stats to the main product blueprint
const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: { type: String, required: true },
    image: { type: String, required: false },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    
    // NEW REVIEW FIELDS
    reviews: [reviewSchema], // Array of review objects
    rating: { type: Number, required: true, default: 0 }, // The average (e.g., 4.5 stars)
    numReviews: { type: Number, required: true, default: 0 }, // Total count of reviews
    
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;