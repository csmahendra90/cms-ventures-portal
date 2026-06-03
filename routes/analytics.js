const express = require('express');
const router = express.Router();
const { analyticsData, deals, portfolio } = require('../data/store');

router.get('/kpis', (req, res) => res.json({ success: true, data: analyticsData.kpis }));
router.get('/monthly-flow', (req, res) => res.json({ success: true, data: analyticsData.monthlyFlow }));
router.get('/sectors', (req, res) => res.json({ success: true, data: analyticsData.sectorBreakdown }));
router.get('/funnel', (req, res) => {
  const stages = ['Screening','Due Diligence','Term Sheet','Invested','Passed'];
  const funnel = stages.map(s => ({ stage: s, count: deals.filter(d => d.stage === s).length }));
  res.json({ success: true, data: funnel });
});

module.exports = router;
