const User = require("../../models/User");
const Module = require("../../models/Module");
const Course = require("../../models/Course");
const asyncHandler = require("../../middleware/async");
const moment = require("moment");
const { saveResult } = require("./result/result");
const { default: mongoose } = require("mongoose");

exports.startTest = asyncHandler(async (req, res, next) => {
  let prevActivity = {};
  const userData = await User.findOne({ _id: req.user._id }).select(
    "testActivity testResult"
  );
  const courseId = req.params.courseId;

  const modules = await Module.find({ courseId:new mongoose.Types.ObjectId(courseId) }).exec();
  const courseDetail = await Course.findOne({ _id: courseId }).exec();
  const testDuration = parseInt(courseDetail.testTiming) * 60;
  let differenceInSeconds = 1;

  let checkPrevTestCourse = userData.testResult.find(
    (item) => item.courseId == courseId
  );
  if (checkPrevTestCourse) {
    let checkPrevTestAttempt = userData.testResult.find(
      (item) => item.courseId == courseId && item.attemptCount > 1
    );
    if (checkPrevTestAttempt) {
      return res.status(400).json({
        message:"You have reached your limit plz contact with your centre"
      })
    }
  }

  if (!!userData.testActivity.startTime) {
    let startTime = moment(userData.testActivity.startTime);
    let currentTime = moment();
    differenceInSeconds = Math.floor((currentTime - startTime) / 1000);

    if (differenceInSeconds >= testDuration) {
      // now check attempt count
      if (userData.testResult.length) {
        //check courseId and attemptCount
        if (
          userData.testResult.find(
            (item) => item.courseId == courseId && item.attemptCount > 1
          )
        ) {
          return res.status(200).json({
            message:
              "You are not able to give test after 2 time.  Plz contact to admin",
          });
        }
      }
      const callBack = (resp) => {
        res.json({
          data: resp,
        });
      };
      req.answer = userData.testActivity.answer;
      req.courseId = userData.testActivity.courseId || courseId;
      req.noOfAllQuestion = userData.testActivity.noOfAllQuestion;
      await saveResult(req, callBack);
      // case : when developer start test and never close the test
    }
    prevActivity = userData.testActivity;
    // req.courseId = courseDetail._id;
    // req.courseName = courseDetail.name;
    // await updateResult(req);
  } else {
  }

  let allQuestions = [];
  // Prepare the response in the desired format
  modules.map((module) => {
    allQuestions.push(module.questions);
  });

  let finalAnswer = [];
  for await (let qstn of allQuestions) {
    // console.log("qstn",qstn)
    for await (let obj of qstn) {
      if (obj.question) {
        finalAnswer.push({ question: obj.question, options: obj.options });
      }
    }
  }

  // update Activity

  // await User.updateOne(
  //   { _id: req.user._id },
  //   {
  //     $set: {
  //       testActivity: {
  //         startTime: new Date(),
  //       },
  //     },
  //   }
  // );
  // Respond with the formatted data
  return res.json({
    timeLeft: testDuration - differenceInSeconds,
    question: finalAnswer,
    prevActivity,
  });
});

exports.getCourses = asyncHandler(async (req, res, next) => {
  // Retrieve user details with populated userCourse from the database
  const user = await User.findOne({ _id: req.user._id }).populate(
    "userCourse",
    "name duration cuttOffScore maxMark testTiming createdAt"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const studentDetails = {
    courseDetail: [],
  };

  for await (let course of user?.userCourse) {
    const modules = await Module.find({ courseId: course._id });
    const courseModules = modules.filter((module) =>
      module.courseId.equals(course._id)
    );
    const questionNo = courseModules.reduce((total, module) => {
      const questionsWithAnswer = module.questions.filter(
        (question) => question.answer
      );
      return total + questionsWithAnswer.length;
    }, 0);
    studentDetails.courseDetail.push({
      name: course.name,
      duration: course.duration,
      cuttOffScore: course.cuttOffScore,
      maxMark: course.maxMark,
      testTiming: course.testTiming,
      questionNo,
      _id: course._id,
    });
  }

  // Send the response
  return res.json(studentDetails);
});

exports.saveResult = asyncHandler(async (req, res, next) => {
  // Find the user by ID
  let answer = req.body.answer;
  const user = await User.findById(req.user._id);
  req.answer = answer;
  req.courseId = req.body.courseId;
  req.noOfAllQuestion = req.body.noOfAllQuestion;

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  await saveResult(req, callBack);
  function callBack(resp) {
    return res.json({ message: "Updated Successfully", data: resp });
  }
});
exports.updateActivity = asyncHandler(async (req, res, next) => {
  // Find the user by ID
  const user = await User.findById(req.user._id);
  user.testActivity.lastQuestionNo = req.body.lastQuestionNo;
  user.testActivity.answer = req.body.answer;
  user.testActivity.noOfAllQuestion = req.body.noOfAllQuestion;
  user.testActivity.courseId = new mongoose.Types.ObjectId(req.body.courseId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  await user.save();
  return res.json({ msg: "Updated Successfully" });
});
