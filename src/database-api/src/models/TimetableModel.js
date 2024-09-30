const mongoose = require("mongoose");

const tutorialSchema = new mongoose.Schema({
  daysOfWeek: {
    required: true,
    type: String
  },
  endTime: {
    required: true,
    type: String
  },
  course_code: {
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

const timetableSchema = new mongoose.Schema({
  created: {
    required: true,
    type: String
  },
  timetable: {
    required: true,
    type: [tutorialSchema]
  }
})

module.exports = mongoose.model('Timetable', timetableSchema)
