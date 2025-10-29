const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load products' });
  }
});

module.exports = router;