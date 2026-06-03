require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const session = require('express-session');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:            process.env.SESSION_SECRET || 'vertex-capital-2026',
  resave:            false,
  saveUninitialized: true,
  cookie:            { secure: false },
}));

// MongoDB — optional, falls back to in-memory store
require('./db/connect')();

app.use('/api/deals',     require('./routes/deals'));
app.use('/api/team',      require('./routes/team'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/termsheet', require('./routes/termsheet'));

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Vertex Capital Portal`);
  console.log(`   URL     → http://0.0.0.0:${PORT}`);
  console.log(`   MongoDB → ${process.env.MONGO_URI ? 'Atlas connected' : 'in-memory fallback'}\n`);
});
