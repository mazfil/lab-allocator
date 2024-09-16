const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  type: {
    required: true,
    type: String
  },
  message:{
    required: true,
    type: String
  }
})

module.exports = mongoose.model('Log', logSchema)