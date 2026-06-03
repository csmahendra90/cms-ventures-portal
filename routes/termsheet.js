const express = require('express');
const router = express.Router();

const termsheets = [
  {
    id: 1, dealName: 'AgriLink', color: '#1D9E75', sector: 'AgriTech',
    status: 'Signed', ask: 3, equity: 19.5, postMoney: 15.4, instrument: 'CCPS',
    founder: 'Kabir Nair', analyst: 'Rajan M.', partner: 'Priya S.',
    agreedClauses: 12, totalClauses: 12,
  },
  {
    id: 2, dealName: 'DataMesh', color: '#7F77DD', sector: 'SaaS',
    status: 'Negotiating', ask: 5.5, equity: 17, postMoney: 32.4, instrument: 'CCPS',
    founder: 'Shreya Iyer', analyst: 'Priya S.', partner: 'Priya S.',
    agreedClauses: 5, totalClauses: 12,
  },
  {
    id: 3, dealName: 'LogiTrack', color: '#D85A30', sector: 'SaaS',
    status: 'Pending sign', ask: 8, equity: 22, postMoney: 36.4, instrument: 'CCPS',
    founder: 'Manish Batra', analyst: 'Vikram T.', partner: 'Rajan M.',
    agreedClauses: 12, totalClauses: 12,
  },
];

router.get('/', (req, res) => res.json({ success: true, data: termsheets }));
router.get('/:id', (req, res) => {
  const ts = termsheets.find(t => t.id === parseInt(req.params.id));
  if (!ts) return res.status(404).json({ success: false, message: 'Term sheet not found' });
  res.json({ success: true, data: ts });
});
router.patch('/:id/status', (req, res) => {
  const ts = termsheets.find(t => t.id === parseInt(req.params.id));
  if (!ts) return res.status(404).json({ success: false, message: 'Not found' });
  ts.status = req.body.status || ts.status;
  res.json({ success: true, data: ts });
});

module.exports = router;
