const mongoose = require("mongoose");

const tutorialSchema = new mongoose.Schema({
  after_lecture: {
    required: true,
    type: Boolean
  },
  byod: {
    required: true,
    type: Boolean
  },
  projector: {
    required: true,
    type: Boolean
  },
  tut_days: {
    required: true,
    type: [String]
  },
  tut_duration: {
    required: true,
    type: Number
  },
  tut_start_time: {
    required: true,
    type: String
  },
  tut_end_time: {
    required: true,
    type: String
  }
})

const lectureSchema = new mongoose.Schema({
  day: {
    required: true,
    type: String
  },
  duration: {
    required: true,
    type: Number
  },
  time: {
    required: true,
    type: Number
  }
})

const courseSchema = new mongoose.Schema({
  course_code: {
    required: true,
    type: String
  },
  est_size: {
    required: true,
    type: Number
  },
  lectures: {
    required: true,
    type: [lectureSchema]
  },
  mix_cohorts: {
    required: true,
    type: Boolean
  },
  num_tutors: {
    required: true,
    type: Number
  },
  tutorial_properties: {
    required: true,
    type: tutorialSchema
  }
})

module.exports = mongoose.model('Course', courseSchema)