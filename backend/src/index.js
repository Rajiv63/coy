'use strict';

const express   = require('express');
const cors      = require('cors');
const apiRoutes = require('./routes/api');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`[Coy server] listening on http://localhost:${PORT}`);
});

module.exports = app;
