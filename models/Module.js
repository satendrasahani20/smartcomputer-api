const  mongoose  = require("mongoose");

const ModuleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },
  moduleName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
  questions: {
    type: [
      {
        question: String,
        options: Array,
        answer: String,
      },
    ],
    default: "",
  },
});
module.exports = mongoose.model('module', ModuleSchema);