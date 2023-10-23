const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    default: "",
  },
  cuttOffScore: {
    type: Number,
    required: true,
  },
  maxMark: {
    type: Number,
    required: true,
  },
  testTiming: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('course', CourseSchema);