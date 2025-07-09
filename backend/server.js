const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const loadRoutes = require('./routes/Loadroutes');
const driverRoutes = require('./routes/driverRoutes');
const truckRoutes = require('./routes/truckRoutes');
const brokerRoutes = require('./routes/brokerRoutes');
const authRoutes = require('./routes/authRoutes');
const rateConfirmationRoutes = require('./routes/rateConfirmationRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const documentRoutes = require('./routes/documentRoutes');
const eldRoutes = require('./routes/eld');
const newInvoiceRoutes = require('./routes/invoices');

dotenv.config();
const app = express();

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'PWP API Server is running', status: 'OK' });
});

// API status route
app.get('/api', (req, res) => {
  res.json({ message: 'PWP API is working', version: '1.0.0' });
});

// Connect to database
connectDB();

// Route handlers
app.use('/api/loads', loadRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/broker', brokerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/rate-confirmation', rateConfirmationRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/loads', documentRoutes);
app.use('/api/eld', eldRoutes);
app.use('/api/invoice', newInvoiceRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});