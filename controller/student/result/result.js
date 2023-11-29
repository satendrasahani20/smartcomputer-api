const User = require("../../../models/User");
const Module = require("../../../models/Module");
const Course = require("../../../models/Course");
const { default: mongoose } = require("mongoose");
const asyncHandler = require("../../../middleware/async");
exports.saveResult = async (req, callBack) => {
  const allQuestion = await Module.find({ courseId: req.courseId }).select(
    "questions"
  );
  const courseDetail = await Course.findOne({ _id: req.courseId });
  const oneQuestionMark =
    parseFloat(courseDetail.maxMark) / req.noOfAllQuestion;
  let obtainedScore = 0;
  for await (let answer of req.answer) {
    for await (let qstn of allQuestion) {
      if (
        qstn.questions.some(
          (item) =>
            item.question == answer.questionName && item.answer == answer.answer
        )
      ) {
        obtainedScore = oneQuestionMark + obtainedScore;
      }
    }
  }

  const user = await User.findById(req.user._id);
  // Increment the attemptCount by 1
  let maxAttempt = 0;
  let testId = Math.floor(100000 + Math.random() * 900000);
  for await (let result of user.testResult) {
    if (req.courseId == result.courseId) {
      if (maxAttempt < result.attemptCount) {
        maxAttempt = result.attemptCount;
      }
    }
    if(testId==result?.testId){
      testId = Math.floor(100000 + Math.random() * 900000);
    }
  }
  maxAttempt = maxAttempt + 1;
  // Update the testResult field with the provided data and incremented attemptCount
  user.testResult.push({
    attemptCount: maxAttempt,
    attemptAt: new Date(),
    courseId: req.courseId ? new mongoose.Types.ObjectId(req.courseId) : "",
    courseName: courseDetail.name,
    maxMark: courseDetail.maxMark,
    cuttOffScore: courseDetail.cuttOffScore,
    obtainedScore,
    testId,
    status: courseDetail.cuttOffScore <= obtainedScore ? "passed" : "failed",
  });
  user.testActivity = {};

  // // // Save the updated user
  await user.save();
  callBack(user.testResult);
};

function getUniqueResultsByAttemptCount(courseResults) {
  // Create an object to store the highest attempt count for each course
  const highestAttempts = {};

  // Iterate through the course results array
  courseResults.forEach((result) => {
    const courseId = result.courseId;

    // If the course is not in the highestAttempts object or the current attempt count is higher
    if (!highestAttempts[courseId] || result.attemptCount > highestAttempts[courseId]) {
      highestAttempts[courseId] = result.attemptCount;
    }
  });

  // Filter the course results array to include only the records with the highest attempt count for each course
  const uniqueResults = courseResults.filter((result) => {
    return result.attemptCount === highestAttempts[result.courseId];
  });

  return uniqueResults;
}


exports.getResult = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({_id:req.user._id}).select("testResult")
  // const courseResults = [
  //   // ... (your course results array here)
  // ];
  
  const uniqueResults = getUniqueResultsByAttemptCount(user.testResult);
  return res.json(uniqueResults);


});
