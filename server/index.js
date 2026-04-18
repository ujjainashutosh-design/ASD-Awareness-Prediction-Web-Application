const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const predictRoutes = require('./routes/predict');
const resultsRoutes = require('./routes/results');

const app = express();
const PORT = process.env.PORT || 3001;

// Allow all localhost origins (works for any Vite port)
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || origin.startsWith('http://localhost')) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/results', resultsRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Catch-all: always return JSON (never HTML) so the frontend gets a clear error
app.use((_req, res) => res.status(404).json({ error: 'API route not found' }));

app.listen(PORT, () => {
  console.log(`✅ SpectrumSense API running at http://localhost:${PORT}`);
});
