'use strict';

const express   = require('express');
const cors      = require('cors');
const apiRoutes = require('./routes/api');

const PORT = process.env.PORT || 5000;

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Render health checks) or matching origins
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`[Coy server] listening on http://localhost:${PORT}`);
});

module.exports = app;
