const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: {
    required: true,
    type: String
  },
  createdAt: {
    required: true
  }
})

module.exports = mongoose.model('Token', courseSchema)