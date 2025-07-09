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
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();
const app = express();

// Security middleware
app.use(helmet()); // Add security headers

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173'
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '1mb' }));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'PWP API Server is running', status: 'OK' });
});

// API status route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'PWP API is working', 
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message,
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  if (process.env.NODE_ENV === 'production') {
    server.close(() => process.exit(1));
  }
});
