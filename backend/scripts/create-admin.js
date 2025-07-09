require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const readline = require('readline');
const crypto = require('crypto');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI environment variable not set');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    return false;
  }
};

// Generate a secure random password
const generateSecurePassword = () => {
  return crypto.randomBytes(12).toString('hex');
};

// Create admin user with provided or generated details
const createAdmin = async (adminDetails) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminDetails.email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminDetails.password, 12);
    
    // Create new admin user
    const user = new User({
      email: adminDetails.email,
      password: hashedPassword,
      name: adminDetails.name,
      role: 'admin'
    });
    
    await user.save();
    console.log('\nAdmin user created successfully');
    console.log(`Email: ${adminDetails.email}`);
    console.log(`Password: ${adminDetails.password}`);
    console.log('\nPlease save these credentials securely and change the password after first login.');
  } catch (err) {
    console.error('Error creating admin user:', err.message);
  }
};

// Prompt for admin details
const promptAdminDetails = () => {
  return new Promise((resolve) => {
    const adminDetails = {
      email: '',
      password: '',
      name: ''
    };

    console.log('\nCreate Admin User');
    console.log('=================');

    rl.question('Enter admin email (default: admin@pwp.com): ', (email) => {
      adminDetails.email = email || 'admin@pwp.com';
      
      rl.question('Enter admin name (default: Admin User): ', (name) => {
        adminDetails.name = name || 'Admin User';
        
        rl.question('Enter admin password (leave blank to generate secure password): ', (password) => {
          adminDetails.password = password || generateSecurePassword();
          resolve(adminDetails);
        });
      });
    });
  });
};

// Run the script
(async () => {
  const connected = await connectDB();
  if (connected) {
    const adminDetails = await promptAdminDetails();
    await createAdmin(adminDetails);
    rl.close();
    mongoose.disconnect();
    console.log('Database disconnected');
  }
})();