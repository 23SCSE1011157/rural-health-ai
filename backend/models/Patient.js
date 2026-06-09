const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  age: {
    type: Number,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },

  symptoms: {
    type: [String],
    required: true,
  },

  riskLevel: {
    type: String,
    default: "Low",
  },
  
  diagnosis: {
  type: String,
  default: "General Checkup Needed",
},

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Patient", patientSchema);