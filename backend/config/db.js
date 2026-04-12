// backend/config/db.js

import mongoose from 'mongoose';
import colors from 'colors'; 

const connectDB = async () => {
  try {
    // Removed the deprecated options, just passing the URI
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
    process.exit(1); 
  }
};

export default connectDB;