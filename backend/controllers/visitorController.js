const mongoose = require('mongoose');
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

/**
 * PUT /api/visitors/:id
 * Update a visitor (only fields sent will be changed)
 */
const updateVisitor = async (req, res) => {
  const { id } = req.params;

  // safety on bad ids
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid visitor id' });
  }

  try {
    const v = await Visitor.findById(id);
    if (!v) return res.status(404).json({ message: 'Visitor not found' });

    const { name, phone, purpose, host, checkIn, checkOut, status } = req.body;

    if (name !== undefined) v.name = name;
    if (phone !== undefined) v.phone = phone;
    if (purpose !== undefined) v.purpose = purpose;
    if (host !== undefined) v.host = host;
    if (checkIn !== undefined) v.checkIn = checkIn ? new Date(checkIn) : undefined;
    if (checkOut !== undefined) v.checkOut = checkOut ? new Date(checkOut) : undefined;
    if (status !== undefined) v.status = status; // 'In' | 'Out'

    const updated = await v.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  addVisitor,
  getVisitors,
  updateVisitor,
};
