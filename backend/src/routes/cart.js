const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    const items = await prisma.cartItem.findMany({
      include: { product: true },
      orderBy: { id: 'asc' }
    });

    const total = items.reduce((s, it) => s + it.qty * it.product.price, 0);

    res.json({ items, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// POST /api/cart { productId, qty }
router.post('/', async (req, res) => {
  try {
    const { productId, qty } = req.body;
    if (!productId || typeof qty !== 'number') {
      return res.status(400).json({ error: 'productId and qty required' });
    }

    if (qty <= 0) {
      await prisma.cartItem.deleteMany({ where: { productId } });
      return res.json({ ok: true });
    }

    const existing = await prisma.cartItem.findFirst({ where: { productId } });
    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { qty }
      });
      return res.json(updated);
    } else {
      const created = await prisma.cartItem.create({
        data: { productId, qty },
        include: { product: true }
      });
      return res.json(created);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add/update cart item' });
  }
});

// DELETE /api/cart/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.cartItem.delete({ where: { id } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
});

module.exports = router;