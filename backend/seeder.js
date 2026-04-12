// backend/seeder.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Wipe out the existing database so we don't duplicate data
    await Product.deleteMany();
    await User.deleteMany();

    // 2. Insert our users
    const createdUsers = await User.insertMany(users);

    // 3. Get the Admin user's ID (the first user we created)
    const adminUser = createdUsers[0]._id;

    // 4. Attach the Admin user ID to every product (since an admin "created" them)
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // 5. Insert the products into the database
    await Product.insertMany(sampleProducts);

    console.log('Data Imported successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ₹{error.message}`.red.inverse);
    process.exit(1);
  }
};

// We run the function immediately when the file is executed
importData();