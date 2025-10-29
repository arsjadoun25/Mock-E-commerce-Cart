const express = require('express');
const router = express.Router();
const prisma = require('../db');

function isValidEmail(email) {
  // email regex for basic validation
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/checkout { name?, email?, cartItems? }
router.post('/', async (req, res) => {
  try {
    const { name, email, cartItems } = req.body;

    // Server-side validation: require name and email
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required for checkout' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Use provided cartItems or fetch from DB
    let items;
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      items = cartItems;
    } else {
      const rows = await prisma.cartItem.findMany({ include: { product: true } });
      items = rows.map(r => ({ productId: r.productId, name: r.product.name, price: r.product.price, qty: r.qty }));
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const total = items.reduce((s, it) => s + it.price * it.qty, 0);

    const receipt = await prisma.receipt.create({
      data: {
        total,
        items: JSON.stringify(items),
        customerName: name || null,
        customerEmail: email || null
      }
    });

    // Clear cart
    await prisma.cartItem.deleteMany({});

    res.json({
      receipt: {
        id: receipt.id,
        total: receipt.total,
        items,
        timestamp: receipt.createdAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

module.exports = router;