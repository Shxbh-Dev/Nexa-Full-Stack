// backend/routes/orderRoutes.js

import express from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import { protect } from '../middleware/authMiddleware.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, utrNumber, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    } else {
      const order = new Order({
        user: req.user._id,
        orderItems: orderItems.map((x) => ({ ...x, product: x._id })),
        shippingAddress,
        paymentMethod,
        utrNumber, 
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      const backendUrl = process.env.NODE_ENV === 'production' ? 'https://your-live-domain.com' : 'http://localhost:5000';

      let utrAlert = '';
      if (paymentMethod === 'BHIM UPI' && utrNumber) {
        utrAlert = `
          <div style="background-color: #fff3cd; color: #856404; padding: 15px; border: 1px solid #ffeeba; border-radius: 4px; margin-bottom: 20px;">
            <h3 style="margin-top: 0;">⚠️ Verify UPI Payment</h3>
            <p>UTR Number: <strong style="font-size: 18px;">${utrNumber}</strong></p>
            <p>Please check your bank app to verify receiving <strong>$${totalPrice}</strong>.</p>
            
            <div style="margin-top: 25px; margin-bottom: 10px;">
              <a href="${backendUrl}/api/orders/${createdOrder._id}/email-action?action=confirm" style="background-color: #059669; color: white; padding: 14px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">✅ Confirm Payment</a>
              
              <a href="${backendUrl}/api/orders/${createdOrder._id}/email-action?action=cancel" style="background-color: #dc2626; color: white; padding: 14px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; margin-left: 15px;">❌ Cancel & Delete</a>
            </div>
            <p style="font-size: 12px; color: #666;">Clicking Cancel will instantly delete the order and prompt the user to re-order.</p>
          </div>
        `;
      }

      const emailMessage = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2>New Order Received! 🎉</h2>
          <p>Order ID: <strong>${createdOrder._id}</strong></p>
          <p>Customer: <strong>${req.user.name}</strong> (${req.user.email})</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          
          ${utrAlert}

          <h3>Order Summary:</h3>
          <p>Total Items: ${orderItems.length}</p>
          <p>Payment Method: <strong>${paymentMethod}</strong></p>
          <h2>Total Value: $${totalPrice.toFixed(2)}</h2>
        </div>
      `;

      try {
        await sendEmail({
          email: process.env.ADMIN_EMAIL,
          subject: `New Order Alert - #${createdOrder._id}`,
          message: emailMessage,
        });
      } catch (error) {
        console.error('Email failed to send.', error);
      }

      res.status(201).json(createdOrder);
    }
  })
);

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get(
  '/myorders',
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }); // Newest first
    res.json(orders);
  })
);

// @desc    Cancel/Delete an order (User or Admin)
// @route   DELETE /api/orders/:id
// @access  Private
router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Check if the user owns the order, OR if they are an Admin
      if (order.user.toString() === req.user._id.toString() || req.user.isAdmin) {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: 'Order successfully cancelled and removed.' });
      } else {
        res.status(401);
        throw new Error('Not authorized to cancel this order');
      }
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  })
);

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  })
);


// --- THE MAGIC ONE-CLICK EMAIL ROUTE ---
router.get(
  '/:id/email-action',
  asyncHandler(async (req, res) => {
    const { action } = req.query;
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).send('<h1 style="text-align:center; font-family:sans-serif; margin-top:50px;">Order not found or already deleted.</h1>');
    }

    if (action === 'confirm') {
      order.isPaid = true;
      order.paidAt = Date.now();
      await order.save();

      await sendEmail({
        email: order.user.email,
        subject: `Payment Confirmed - Order #${order._id}`,
        message: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #059669;">Payment Successfully Verified!</h2>
            <p>Hi ${order.user.name},</p>
            <p>Great news! We have successfully verified your UTR number (<strong>${order.utrNumber}</strong>).</p>
            <p>Your payment of <strong>$${order.totalPrice.toFixed(2)}</strong> has been marked as Paid, and we are now processing your items for shipment.</p>
            <p>Thank you for shopping with NEXA.</p>
          </div>
        `
      });

      res.send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 100px;">
          <h1 style="color: #059669; font-size: 40px;">✅ Order Confirmed!</h1>
          <p style="font-size: 18px;">Order <strong>#${order._id}</strong> has been marked as Paid.</p>
          <p style="color: #666;">A confirmation email has automatically been sent to <strong>${order.user.email}</strong>.</p>
        </div>
      `);

    } else if (action === 'cancel') {
      
      // 1. Email the Customer with Re-order instructions
      await sendEmail({
        email: order.user.email,
        subject: `Order Cancelled: Invalid UTR - Order #${order._id}`,
        message: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #dc2626;">Payment Verification Failed</h2>
            <p>Hi ${order.user.name},</p>
            <p>Sorry, we were unable to verify your payment using the UTR number provided (<strong>${order.utrNumber}</strong>). As a result, your order has been cancelled.</p>
            <p><strong>If you believe this is a mistake and your money was deducted:</strong></p>
            <p>Please return to our website, place a new order with the exact same items, and enter your UTR number again. We will gladly re-check it for you.</p>
            <p>Thank you,<br/>NEXA Support</p>
          </div>
        `
      });

      // 2. Delete the order completely from MongoDB
      await Order.findByIdAndDelete(order._id);

      // 3. Show Rejection Screen to Admin
      res.send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 100px;">
          <h1 style="color: #dc2626; font-size: 40px;">❌ Order Cancelled & Deleted.</h1>
          <p style="font-size: 18px;">The order has been removed from the database.</p>
          <p style="color: #666;">An alert email has automatically been sent to <strong>${order.user.email}</strong> instructing them to re-order if their money was deducted.</p>
        </div>
      `);
    } else {
      res.send('<h1>Invalid Action</h1>');
    }
  })
);

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    // Security check: Only admins can do this
    if (!req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized as an Admin');
    }
    // Fetch all orders and attach the user's name and ID to them
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  })
);

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
router.put(
  '/:id/deliver',
  protect,
  asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized as an Admin');
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  })
);

// @desc    Admin override for Paid/Delivered status
// @route   PUT /api/orders/:id/admin-status
// @access  Private/Admin
router.put(
  '/:id/admin-status',
  protect,
  asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized as an Admin');
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      // Toggle Paid Status if it was sent in the request
      if (req.body.isPaid !== undefined) {
        order.isPaid = req.body.isPaid;
        order.paidAt = req.body.isPaid ? (order.paidAt || Date.now()) : null;
      }
      
      // Toggle Delivered Status if it was sent in the request
      if (req.body.isDelivered !== undefined) {
        order.isDelivered = req.body.isDelivered;
        order.deliveredAt = req.body.isDelivered ? (order.deliveredAt || Date.now()) : null;
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  })
);
export default router;