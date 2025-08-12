// backend/routes/visitorRoutes.js
const express = require('express');
const router = express.Router();

// auth middleware
const { protect } = require('../middleware/authMiddleware');

// controller functions
const { addVisitor, getVisitors } = require('../controllers/visitorController');

// VM‑4 (Create)
router.post('/', protect, addVisitor);

// VM‑5 (List)
router.get('/', protect, getVisitors);

module.exports = router;
