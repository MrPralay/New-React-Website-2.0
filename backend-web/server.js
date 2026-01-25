const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Documentation imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const socialRoutes = require('./routes/socialRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration
app.use(cors());
app.use(express.json());

// Main Route
app.get('/', (req, res) => {
    res.send('SynapseX Neural Gateway is Online...');
});

// API Routes
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', socialRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Neural Gateway active on port ${PORT}`);
});
