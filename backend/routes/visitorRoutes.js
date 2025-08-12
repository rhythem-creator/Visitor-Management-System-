// backend/routes/visitorRoutes.js
const express = require('express');
const router = express.Router();

let protect = (req, res, next) => next();
try { protect = require('../middleware/authMiddleware').protect; } catch (_) {}

const { addVisitor } = require('../controllers/visitorController'); // or visitorCreateController if you split

// ONLY the create endpoint for VM‑4
router.post('/', protect, addVisitor);

module.exports = router;
