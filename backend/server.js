// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

/* ---------- CORS (allow your deployed site + local dev) ---------- */
const EC2_IP = '3.107.202.99'; // <-- put YOUR public IP here
const allowedOrigins = new Set([
  `http://${EC2_IP}`,   // Nginx (80)
  `http://${EC2_IP}:80`,
  'http://localhost:3000',
]);

app.use(cors({
  origin(origin, cb) {
    // allow no-origin tools (curl/Postman)
    if (!origin) return cb(null, true);
    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error('CORS blocked: ' + origin));
  },
  credentials: true,
}));

/* ---------- Parsers ---------- */
app.use(express.json());

/* ---------- DB then routes ---------- */
connectDB();

/* Quick health check */
app.get('/api/health', (_req, res) => res.json({ ok: true }));

/* Mount API routes */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/visitors', require('./routes/visitorRoutes'));

/* ---------- Start server (bind to all interfaces) ---------- */
const PORT = process.env.PORT || 5001;
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
