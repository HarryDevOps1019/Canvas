const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/user');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

// Checkout - Create order from cart
exports.checkout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user's cart
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty. Cannot proceed with checkout.',
      });
    }

    // Calculate total server-side
    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const itemTotal = item.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.product._id,
        productName: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      });
    }

    // Create order
    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      status: 'confirmed',
    });

    // Save order to database
    await order.save();

    // Fetch user details for email
    const user = await User.findById(userId);

    // Send order confirmation email (non-blocking)
    sendOrderConfirmationEmail(order, user);

    // Clear user's cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing checkout',
      error: error.message,
    });
  }
};

// Get all orders of logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
      .populate('items.productId')
      .sort({ orderDate: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(id).populate('items.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Verify order belongs to authenticated user
    if (order.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: This order does not belong to you',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message,
    });
  }
};
