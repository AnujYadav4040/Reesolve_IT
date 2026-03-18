/**
 * Database Seeder - Run this to populate fresh admin user
 * Usage: node seeder.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Technician = require('./models/Technician');
const Ticket = require('./models/Ticket');
const ActivityLog = require('./models/ActivityLog');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany(),
    Technician.deleteMany(),
    Ticket.deleteMany(),
    ActivityLog.deleteMany(),
  ]);
  console.log('Cleared all existing mock data');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('❌ SEEDING FAILED: Please define ADMIN_EMAIL and ADMIN_PASSWORD in your .env file to run this script securely.');
    process.exit(1);
  }

  // Create Fresh Admin
  await User.create({
    name: 'System Admin',
    email: adminEmail,
    password: adminPassword,
    department: 'IT Administration',
    role: 'admin',
    contactNumber: '0000000000',
  });

  console.log('\n✅ Fresh seeding complete!\n');
  console.log('Secure Login Credentials Configured:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Admin Email:  ${adminEmail}`);
  console.log('Password:     [Hidden - Loaded from .env variable]');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
