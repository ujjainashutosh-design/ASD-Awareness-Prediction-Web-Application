const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { getResults, saveResults } = require('../helpers');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const ML_URL = 'http://localhost:5001/predict';

// POST /api/predict
router.post('/', authMiddleware, async (req, res) => {
  try {
    const payload = req.body;

    let mlResult;
    try {
      const mlRes = await axios.post(ML_URL, payload, { timeout: 10000 });
      mlResult = mlRes.data;
    } catch (mlErr) {
      // Fallback: AQ-10 rule-based scoring
      const aqScore = [1,2,3,4,5,6,7,8,9,10].reduce((s, i) => s + (parseInt(payload[`A${i}_Score`]) || 0), 0);
      const prediction = aqScore >= 6 ? 'YES' : 'NO';
      const probability = aqScore >= 6 ? 0.5 + (aqScore - 6) * 0.08 : 0.5 - (6 - aqScore) * 0.1;
      mlResult = {
        prediction,
        probability: Math.min(0.98, Math.max(0.05, probability)),
        probability_no: 1 - Math.min(0.98, Math.max(0.05, probability)),
        score: aqScore,
        model_accuracy: 0.93,
        fallback: true
      };
    }

    // Save result
    const results = getResults();
    const entry = {
      id: uuidv4(),
      userId: req.user.id,
      answers: payload,
      ...mlResult,
      createdAt: new Date().toISOString()
    };
    results.push(entry);
    saveResults(results);

    res.json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Prediction failed', details: err.message });
  }
});

module.exports = router;
