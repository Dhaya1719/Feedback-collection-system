const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// *** FINAL SECURITY MODIFICATION: Lock down CORS to only your frontend URL ***
app.use(cors({
    origin: 'https://YOUR_VERCEL_FRONTEND_URL', // *** REPLACE WITH ACTUAL VERCEL URL ***
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/forms', require('./routes/formRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));