const express = require('express');
const router = express.Router();
const Lender = require('../models/Lender');
const { initialLenders } = require('../seed/lenderData');

// @route   GET /api/lenders
// @desc    Get all lenders
// @access  Public
router.get('/', async (req, res) => {
  try {
    const lenders = await Lender.find();
    return res.status(200).json({
      success: true,
      count: lenders.length,
      data: lenders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch lenders',
      error: error.message
    });
  }
});

// @route   POST /api/lenders/seed
// @desc    Re-seed default lender dataset
// @access  Public
router.post('/seed', async (req, res) => {
  try {
    await Lender.deleteMany();
    const seeded = await Lender.insertMany(initialLenders);
    return res.status(201).json({
      success: true,
      message: `Database re-seeded with ${seeded.length} lenders.`,
      data: seeded
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to seed lenders',
      error: error.message
    });
  }
});

module.exports = router;
