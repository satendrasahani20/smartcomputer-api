const { mongoose } = require("mongoose");
const Module = require("../../models/Module");
const asyncHandler = require("../../middleware/async");
// const ErrorResponse = require("../../utils/errorResponse");

exports.getQuestions = asyncHandler(async (req, res, next) => {
  const moduleId = req.params.moduleId;
  const limit = parseInt(req.query.limit) || 10; // Set your desired default limit
  const page = parseInt(req.query.page) || 1; // Set your desired default page

  const skip = (page - 1) * limit;

  // Find the module by moduleId
  const module = await Module.findById(new mongoose.Types.ObjectId(moduleId));

  if (!module) {
    return res.status(404).json({ error: "Module not found" });
  }

  // Extract questions from the module
  const questions = module.questions || [];

  // Perform pagination
  const paginatedQuestions = questions.slice(skip, skip + limit);

  // Calculate total data count
  const totalDataCount = questions.length;

  // Calculate total pagesmongoosemongoose
  const totalPages = Math.ceil(totalDataCount / limit);

  return res.json({
    data: paginatedQuestions,
    totalDataCount,
    totalPages,
    currentPage: page,
  });
});
exports.addQuestion = asyncHandler(async (req, res, next) => {
  const moduleId = req.params.moduleId;
  const { question, options, answer } = req.body;

  // Find the module by moduleId
  const module = await Module.findById(moduleId);

  if (!module) {
    // return next(new ErrorResponse("Module Not Found", 500));
  }

  // Check for duplicate questions within the module
  const isDuplicateQuestion = module.questions.some(
    (existingQuestion) => existingQuestion.question === question
  );

  if (isDuplicateQuestion) {
    return next(
      // new ErrorResponse("Question already exists in the module", 400)
    );
  }

  // Create a new question object
  const newQuestion = {
    question,
    options,
    answer,
  };

  // Add the new question to the module's questions array
  module.questions.push(newQuestion);

  // Save the updated module
  await module.save();

  res.status(201).json({ success: true, data: newQuestion });
});

exports.updateQuestion = asyncHandler(async (req, res, next) => {
  const moduleId = req.params.moduleId;
  const questionId = req.params.questionId;
  const { question, options, answer } = req.body;

  // Find the module by moduleId
  const module = await Module.findById(moduleId);

  if (!module) {
    return res.status(404).json({ error: "Module not found" });
  }

  // Find the question by _id within the module's questions array
  const existingQuestion = module.questions.id(questionId);

  if (!existingQuestion) {
    return res.status(404).json({ error: "Question not found in the module" });
  }

  // Check for duplicate questions within the module (excluding the question being updated)
  const isDuplicateQuestion = module.questions.some(
    (q) => q.question === question && q._id.toString() !== questionId
  );

  if (isDuplicateQuestion) {
    return res
      .status(400)
      .json({ error: "Question already exists in the module" });
  }

  // Update the question properties
  existingQuestion.question = question;
  existingQuestion.options = options;
  existingQuestion.answer = answer;

  // Save the updated module
  await module.save();

  return res.status(200).json({ success: true, data: existingQuestion });
});
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
  const moduleId = req.params.moduleId;
  const questionId = req.params.questionId;

  // Use the $pull operator to remove the question by questionId
  const result = await Module.updateOne(
    { _id: moduleId },
    { $pull: { questions: { _id: questionId } } }
  );

  if (result.modifiedCount === 0) {
    return res.status(404).json({ message: "Question not found" });
  }

  return res.json({ message: "Question deleted successfully"});
});
