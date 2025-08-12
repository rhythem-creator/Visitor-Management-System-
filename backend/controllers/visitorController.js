// backend/controllers/visitorController.js
const Visitor = require('../models/Visitor');

/**
 * POST /api/visitors
 * Create a visitor
 */
const addVisitor = async (req, res) => {
  const { name, phone, purpose, host, checkIn, status } = req.body;
  try {
    const visitor = await Visitor.create({
      userId: req.user.id,       // set by auth middleware
      name,
      phone,
      purpose,
      host,
      checkIn: checkIn ? new Date(checkIn) : undefined,
      status,
    });
    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/visitors
 * List all visitors for the logged-in user (new for VM‑5)
 */
const getVisitors = async (req, res) => {
  try {
    const list = await Visitor
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 }); // newest first
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addVisitor,
  getVisitors,
};
