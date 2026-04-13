import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';

// Route Imports
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
connectDB();

const app = express();

// --- 1. THE SECURITY GATE (CORS) ---
// This MUST be the first middleware applied
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl) 
    // or specifically from your Vercel domains
    const allowedOrigins = [
      'https://nexa-full-stack.vercel.app',
      'https://nexa-full-stack-git-main-shubham-singhs-projects-d16d74cf.vercel.app',
      'http://localhost:5173'
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Handle pre-flight OPTIONS requests for all routes
app.options('*', cors());

// --- 2. STANDARD MIDDLEWARE ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- 3. ROUTES ---
app.get('/', (req, res) => {
  res.send('NEXA E-commerce API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// --- 4. ERROR HANDLING ---
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);