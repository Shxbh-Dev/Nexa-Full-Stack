// backend/data/products.js

const products = [
  {
    name: 'Arden Armchair',
    images: ['/images/arden-armchair-1.jpg', '/images/arden-armchair-2.jpg'],
    description: 'The armchairs operate as a curated home decor with a minimalist element. A beautiful addition to any modern living space.',
    category: 'Furniture',
    subCategory: 'Armchairs',
    price: 1880,
    material: 'Linen, Oatmeal, Charcoal',
    dimensions: '12.5" x 2.5" x h 13.5 cm',
    colors: ['Cream', 'Black'],
    countInStock: 5,
    rating: 5,
    numReviews: 12,
  },
  {
    name: 'Luna Ceramic Vase - Small',
    images: ['/images/luna-vase-1.jpg'],
    description: 'A beautifully crafted ceramic vase, perfect for minimalist spaces and dry floral arrangements.',
    category: 'Decor',
    subCategory: 'Vases',
    price: 180,
    material: 'Ceramic',
    colors: ['Cream'],
    countInStock: 15,
    rating: 4.5,
    numReviews: 8,
  },
  {
    name: 'Sienna Linen Cushion',
    images: ['/images/sienna-cushion.jpg'],
    description: 'Premium linen cushion in a beautiful gold/mustard tone. Adds warmth and texture to any sofa or bed.',
    category: 'Decor',
    subCategory: 'Textiles',
    price: 180,
    material: 'Linen',
    colors: ['Gold'],
    countInStock: 20,
    rating: 5,
    numReviews: 4,
  },
  {
    name: 'Rumi Terracotta Jar',
    images: ['/images/rumi-jar.jpg'],
    description: 'Handcrafted terracotta jar with a raw, earthy finish.',
    category: 'Decor',
    subCategory: 'Vases',
    price: 250,
    material: 'Terracotta',
    colors: ['Terracotta'],
    countInStock: 0, // Testing out-of-stock functionality
    rating: 4,
    numReviews: 3,
  }
];

export default products;