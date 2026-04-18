const express = require('express');
const { getResults } = require('../helpers');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/results  — user's own results
router.get('/', authMiddleware, (req, res) => {
  const results = getResults();
  const userResults = results
    .filter(r => r.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(userResults);
});

// GET /api/results/:id
router.get('/:id', authMiddleware, (req, res) => {
  const results = getResults();
  const result = results.find(r => r.id === req.params.id && r.userId === req.user.id);
  if (!result) return res.status(404).json({ error: 'Not found' });
  res.json(result);
});

module.exports = router;
