// backend/routes/visitorRoutes.js
const express = require('express');
const router = express.Router();

// auth middleware
const { protect } = require('../middleware/authMiddleware');

// controller functions
const { addVisitor, getVisitors, updateVisitor, deleteVisitor,} = require('../controllers/visitorController');

// VM‑4 (Create)
router.post('/', protect, addVisitor);

// VM‑5 (List)
router.get('/', protect, getVisitors);

// VM-6: update by id
router.put('/:id', protect, updateVisitor);

// VM-7 (Delete)
router.delete('/:id', protect, deleteVisitor);

module.exports = router;
