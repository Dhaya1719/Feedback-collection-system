const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  // Removed adminName as the primary login field
  adminName: { 
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Email must be unique
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Admin', AdminSchema);