const mongoose = require("mongoose");

const timetableSchema = new mongoose.Schema({
  daysOfWeek: {
    required: true,
    type: String
  },
  endTime: {
    required: true,
    type: String 
  },
  id: {
    required: true,
    type: String 
  },
  location: {
    required: true,
    type: String
  },
  startTime: {
    required: true,
    type: String
  },
  title: {
    required: true,
    type: String
  },
})

module.exports = mongoose.model('Timetable', timetableSchema)