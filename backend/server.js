const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const loadRoutes = require('./routes/loadroutes'); // Fixed casing to match actual file

dotenv.config();
const app = express();

app.use(express.json());

// Connect to database
connectDB();

// Route handlers
app.use('/api/loads', loadRoutes);
// Uncomment and add these routes if the files exist
// const driverRoutes = require('./routes/driverRoutes');
// const authRoutes = require('./routes/authRoutes');
// const brokerRoutes = require('./routes/brokerRoutes');
// app.use('/api/drivers', driverRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/broker', brokerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));