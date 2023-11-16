const mongoose = require("mongoose");

const TestActivity = new mongoose.Schema({
  startTime: {
    type: Date,
    default: new Date(),
  },
  lastQuestionNo: {
    type: Number,
    default: 0,
  },
  answer: {
    type: Array,
    default: [],
  },
});
module.exports = mongoose.model("test_activity", TestActivity);
