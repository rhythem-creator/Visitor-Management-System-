// backend/controllers/visitorController.js
const mongoose = require('mongoose');
const Visitor = require('../models/Visitor');

/**
 * POST /api/visitors
 * Create a visitor
 */
const addVisitor = async (req, res) => {
  const { name, phone, purpose, host, checkIn, status } = req.body;

  try {
    const visitor = await Visitor.create({
      userId: req.user.id,             // set by auth middleware
      name,
      phone,
      purpose,
      host,
      checkIn: checkIn ? new Date(checkIn) : undefined,
      status,
    });

    return res.status(201).json(visitor);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/visitors
 * List all visitors for the logged-in user
 */
const getVisitors = async (req, res) => {
  try {
    const list = await Visitor
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 }); // newest first

    return res.json(list);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/visitors/:id
 * Update a visitor (only fields provided will be changed)
 */
const updateVisitor = async (req, res) => {
  const { id } = req.params;

  // Safety on bad IDs
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid visitor id' });
  }

  try {
    const v = await Visitor.findById(id);
    if (!v) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    const { name, phone, purpose, host, checkIn, checkOut, status } = req.body;

    if (name !== undefined) v.name = name;
    if (phone !== undefined) v.phone = phone;
    if (purpose !== undefined) v.purpose = purpose;
    if (host !== undefined) v.host = host;
    if (checkIn !== undefined) v.checkIn = checkIn ? new Date(checkIn) : undefined;
    if (checkOut !== undefined) v.checkOut = checkOut ? new Date(checkOut) : undefined;
    if (status !== undefined) v.status = status; // 'In' | 'Out'

    const updated = await v.save();
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE /api/visitors/:id
 * Delete a visitor (and ensure it belongs to this user, if you enforce that)
 */
const deleteVisitor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid visitor id' });
  }

  try {
    
    const filter = req.user ? { _id: id, userId: req.user.id } : { _id: id };
    const deleted = await Visitor.findOneAndDelete(filter);

    if (!deleted) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    return res.json({ message: 'Visitor deleted', id: deleted._id });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addVisitor,
  getVisitors,
  updateVisitor,
  deleteVisitor,
};