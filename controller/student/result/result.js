
const User = require("../../../models/User");
const Module = require("../../../models/Module");
const Course = require("../../../models/Course");
const { default: mongoose } = require("mongoose");
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
    for await (let result of user.testResult) {
      if (req.courseId == result.courseId) {
        if(maxAttempt <result.attemptCount){
          maxAttempt=result.attemptCount
        }
      }
    }
    maxAttempt=maxAttempt+1;
    // Update the testResult field with the provided data and incremented attemptCount
    user.testResult.push({
      attemptCount:maxAttempt,
      attemptAt: new Date(),
      courseId: req.courseId?new mongoose.Types.ObjectId(req.courseId):"",
      courseName: courseDetail.name,
      maxMark: courseDetail.maxMark,
      cuttOffScore: courseDetail.cuttOffScore,
      obtainedScore,
      status:courseDetail.cuttOffScore<=obtainedScore?"passed":"failed"
    });
    user.testActivity={}
  
    // // // Save the updated user
    await user.save();
    callBack(user.testResult);
  };