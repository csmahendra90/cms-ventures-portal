// routes/portfolio.js
const express = require('express');
const router = express.Router();
const { portfolio } = require('../data/store');

router.get('/', (req, res) => res.json({ success: true, data: portfolio }));
router.get('/summary', (req, res) => {
  const totalInvested   = portfolio.reduce((s,p) => s + p.invested, 0);
  const totalValue      = portfolio.reduce((s,p) => s + p.value, 0);
  const avgMoic         = (portfolio.reduce((s,p) => s + p.moic, 0) / portfolio.length).toFixed(2);
  const avgIrr          = Math.round(portfolio.reduce((s,p) => s + p.irr, 0) / portfolio.length);
  res.json({ success: true, data: { totalInvested, totalValue, avgMoic, avgIrr, count: portfolio.length } });
});

module.exports = router;
