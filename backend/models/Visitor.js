// backend/models/Visitor.js
const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional if no auth
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    purpose: { type: String, trim: true },
    host: { type: String, trim: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    status: { type: String, default: 'In', enum: ['In', 'Out'] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Visitor', VisitorSchema);
