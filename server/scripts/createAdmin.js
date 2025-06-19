const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/adminM'); 
require('dotenv').config({ path: __dirname + '/../.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
      email: 'admin@gmail.com',
      password: hashedPassword
    });
    await admin.save();
    console.log("✅ Admin created");
    mongoose.disconnect();
  });