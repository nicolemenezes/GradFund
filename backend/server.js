const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { seedLenders } = require('./seed/lenderData');
const assessmentRoutes = require('./routes/assessmentRoutes');
const lenderRoutes = require('./routes/lenderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/assessments', assessmentRoutes);
app.use('/api/lenders', lenderRoutes);

// Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    app: 'GradFund API - Phase 1',
    timestamp: new Date()
  });
});

// Database Connection & Server Startup
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gradfund';

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully.');
    // Seed initial lender data if database is empty
    await seedLenders();

    app.listen(PORT, () => {
      console.log(`🚀 GradFund Server running on port ${PORT}`);
      console.log(`📍 API Endpoint: http://localhost:${PORT}/api/assessments`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });
