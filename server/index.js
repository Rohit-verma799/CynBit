require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const api = require('./routes');

const app = express();
const port = Number(process.env.PORT || 4000);
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '24kb' }));
app.use('/api', api);
if (process.env.NODE_ENV === 'production') {
  const clientBuild = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuild));
  app.get('*', (_req, res) => res.sendFile(path.join(clientBuild, 'index.html')));
}
app.listen(port, () => console.log(`Cynbit MERN server listening on http://localhost:${port}`));
if (process.env.MONGODB_URI) mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB connected')).catch((e) => console.error('MongoDB connection failed:', e.message));
