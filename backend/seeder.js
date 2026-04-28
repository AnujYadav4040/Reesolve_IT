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

  // Create Users
  const usersToCreate = [
    {
      name: 'Aman',
      email: process.env.USER_AMAN_EMAIL,
      password: process.env.USER_AMAN_PASSWORD,
      department: 'HR',
      role: 'user',
      contactNumber: '1111111111'
    },
    {
      name: 'Aditya',
      email: process.env.USER_ADITYA_EMAIL,
      password: process.env.USER_ADITYA_PASSWORD,
      department: 'Finance',
      role: 'user',
      contactNumber: '2222222222'
    },
    {
      name: 'Ajay',
      email: process.env.USER_AJAY_EMAIL,
      password: process.env.USER_AJAY_PASSWORD,
      department: 'Operations',
      role: 'user',
      contactNumber: '3333333333'
    }
  ];
  for (const userData of usersToCreate) {
    await User.create(userData);
  }

  // Create Technicians (Each requires a User document and a Technician document)
  const sarveshUser = await User.create({
    name: 'Sarvesh',
    email: process.env.TECH_SARVESH_EMAIL,
    password: process.env.TECH_SARVESH_PASSWORD,
    department: 'IT Support',
    role: 'technician',
    contactNumber: '4444444444'
  });
  await Technician.create({
    user: sarveshUser._id,
    skillSet: ['Network', 'Infrastructure'],
    contactNumber: '4444444444'
  });

  const neerajUser = await User.create({
    name: 'Neeraj',
    email: process.env.TECH_NEERAJ_EMAIL,
    password: process.env.TECH_NEERAJ_PASSWORD,
    department: 'IT Support',
    role: 'technician',
    contactNumber: '5555555555'
  });
  await Technician.create({
    user: neerajUser._id,
    skillSet: ['Hardware', 'Maintenance'],
    contactNumber: '5555555555'
  });

  const vinayakUser = await User.create({
    name: 'Vinayak',
    email: process.env.TECH_VINAYAK_EMAIL,
    password: process.env.TECH_VINAYAK_PASSWORD,
    department: 'IT Support',
    role: 'technician',
    contactNumber: '6666666666'
  });
  await Technician.create({
    user: vinayakUser._id,
    skillSet: ['Software', 'Applications'],
    contactNumber: '6666666666'
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
