const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  after_lecture: {
    required: true,
    type: Boolean
  },
  byod: {
    required: true,
    type: Boolean
  },
  course_code: {
    required: true,
    type: String
  },
  course_size: {
    required: true,
    type: Number
  },
  lab_days: {
    required: true,
    type: [Number]
  },
  lab_duration: {
    required: true,
    type: Number
  },
  lec_day: {
    required: true,
    type: Number
  },
  lec_duration: {
    required: true,
    type: Number
  },
  lec_time: {
    required: true,
    type: Number
  },
  lecture_amount: {
    required: true,
    type: Number
  },
  mix_cohorts: {
    required: true,
    type: Boolean
  },
  projector: {
    required: true,
    type: Boolean
  },
  timerange_from: {
    required: true,
    type: Number
  },
  timerange_until: {
    required: true,
    type: Number
  },
  tutors: {
    required: true,
    type: Boolean
  }
})

module.exports = mongoose.model('Course', courseSchema)