const express = require('express');
const router = express.Router();
const { deals } = require('../data/store');

// GET all deals (with optional filters)
router.get('/', (req, res) => {
  let result = [...deals];
  const { stage, sector, city, priority, search } = req.query;
  if (stage)    result = result.filter(d => d.stage === stage);
  if (sector)   result = result.filter(d => d.sector === sector);
  if (city)     result = result.filter(d => d.city === city);
  if (priority) result = result.filter(d => d.priority === priority);
  if (search)   result = result.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.sector.toLowerCase().includes(search.toLowerCase())
  );
  res.json({ success: true, count: result.length, data: result });
});

// GET single deal
router.get('/:id', (req, res) => {
  const deal = deals.find(d => d.id === parseInt(req.params.id));
  if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
  res.json({ success: true, data: deal });
});

// POST new deal
router.post('/', (req, res) => {
  const { name, sector, city, ask, stage, priority, analyst } = req.body;
  if (!name || !sector) return res.status(400).json({ success: false, message: 'name and sector required' });
  const newDeal = {
    id: deals.length + 1,
    name, sector, city: city || 'Mumbai',
    ask: parseFloat(ask) || 0,
    score: 60,
    stage: stage || 'Screening',
    priority: priority || 'Medium',
    analyst: analyst || 'Unassigned',
    days: 0,
    source: req.body.source || 'Cold application',
    founded: req.body.founded || new Date().getFullYear(),
    team: parseInt(req.body.team) || 1,
    bg: '#E6F1FB', tc: '#0C447C',
    init: name.slice(0,2).toUpperCase(),
  };
  deals.push(newDeal);
  res.status(201).json({ success: true, data: newDeal });
});

// PATCH update deal stage
router.patch('/:id/stage', (req, res) => {
  const deal = deals.find(d => d.id === parseInt(req.params.id));
  if (!deal) return res.status(404).json({ success: false, message: 'Deal not found' });
  const stages = ['Screening','Due Diligence','Term Sheet','Invested','Passed'];
  const { stage } = req.body;
  if (!stages.includes(stage)) return res.status(400).json({ success: false, message: 'Invalid stage' });
  deal.stage = stage;
  res.json({ success: true, data: deal });
});

// DELETE deal (pass / remove)
router.delete('/:id', (req, res) => {
  const idx = deals.findIndex(d => d.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, message: 'Deal not found' });
  deals.splice(idx, 1);
  res.json({ success: true, message: 'Deal removed' });
});

module.exports = router;
