// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

/* ---------- CORS ----------
   Frontend is served by Nginx on the SAME EC2 host (http://<EC2-IP>).
   For local dev, we allow http://localhost:3000.
   For prod, we simply reflect the request origin (Nginx) and keep localhost.
*/
app.use(
  cors({
    origin: (origin, cb) => {
      // allow curl/Postman/no-origin
      if (!origin) return cb(null, true);
      if (origin.includes('localhost:3000')) return cb(null, true); // dev
      // anything else (e.g., http://<EC2-IP>) is fine because it's same-origin through Nginx
      return cb(null, true);
    },
    credentials: true,
  })
);

/* ---------- Parsers ---------- */
app.use(express.json());

/* ---------- DB then routes ---------- */
connectDB();

/* Health */
app.get('/api/health', (_req, res) => res.json({ ok: true }));

/* API */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/visitors', require('./routes/visitorRoutes'));

/* ---------- Start ---------- */
const PORT = process.env.PORT || 5001;
// bind to all interfaces so Nginx/EC2 can reach it
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
