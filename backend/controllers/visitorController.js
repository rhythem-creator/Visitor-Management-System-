// backend/controllers/visitorController.js
const Visitor = require('../models/Visitor');

/**
 * POST /api/visitors
 * Create a visitor
 */
const addVisitor = async (req, res) => {
  try {
    const { name, phone, purpose, host, checkIn, checkOut, status } = req.body;

    const visitor = await Visitor.create({
      userId: req.user?.id || req.body.userId, // falls back to body if no auth
      name,
      phone,
      purpose,
      host,
      checkIn: checkIn ? new Date(checkIn) : undefined,
      checkOut: checkOut ? new Date(checkOut) : undefined,
      status: status || 'In'
    });

    res.status(201).json(visitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addVisitor };
