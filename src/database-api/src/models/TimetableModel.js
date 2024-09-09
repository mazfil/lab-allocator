const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  _id: {
    required: true,
    type: Number,
  },
  created: {
    required: true,
    type: String
  },
  timetable: {
    required: true,
    type: [Object]
  }
  
})

module.exports = mongoose.model('Timetable', timetableSchema)