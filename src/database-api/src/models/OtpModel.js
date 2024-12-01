const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otp: {
    required: true,
    type: String
  }
})

module.exports = mongoose.model('Otp', courseSchema)