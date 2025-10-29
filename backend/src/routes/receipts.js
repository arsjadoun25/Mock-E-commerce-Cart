const express = require('express');
const router = express.Router();
const prisma = require('../db');

// GET /api/receipts
router.get('/', async (req, res) => {
  try {
    const receipts = await prisma.receipt.findMany({
      orderBy: { id: 'desc' }
    });
    // return receipts as is
    res.json(receipts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
});

module.exports = router;