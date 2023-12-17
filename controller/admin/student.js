// const ErrorResponse = require('../utils/errorResponse');
const { default: mongoose, mongo } = require("mongoose");
const asyncHandler = require("../../middleware/async");
const User = require("../../models/User");

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/Admin
exports.getStudentLists = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Current page (default: 1)
  const perPage = parseInt(req.query.perPage) || 10; // Items per page (default: 10)
  const searchTerm = req.query.search;
  const role = req.query.role;
  // Define the aggregation pipeline
  const pipeline = [
    {
      $match: {
        role: role, // Filter for users with the 'student' role

        $or: [
          { name: { $regex: searchTerm, $options: "i" } }, // Search by name (case-insensitive)
          { email: { $regex: searchTerm, $options: "i" } }, // Search by email (case-insensitive)
          { number: { $regex: searchTerm, $options: "i" } }, // Search by number (case-insensitive)
        ],
      },
    },
  ];
  if (req.user.role == "quardinate" || req.user.role == "centre") {
    pipeline.push({
      $match: {
        "registerBy._id": req.user._id,
      },
    });
  }
  let totalDataCount = await User.aggregate(pipeline).count("studentCount");
  // Perform pagination using $skip and $limit
  pipeline.push({ $skip: (page - 1) * perPage }, { $limit: perPage });

  // Execute the aggregation
  const studentsByCourse = await User.aggregate(pipeline);
  totalDataCount = totalDataCount?.[0]?.studentCount;

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalDataCount / perPage);
  let data = [];
  data = studentsByCourse;
  // Create the response object
  const response = {
    data,
    totalDataCount,
    totalPages,
    currentPage: page,
  };

  res.json(response);
});

// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Private/Admin
exports.getStdent = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    // return next(new ErrorResponse(`No user with the id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Create user
// @route     POST /api/v1/users
// @access    Private/Admin
exports.registerStudent = asyncHandler(async (req, res, next) => {
  if (!req.body.image) {
    return res.status(400).json({
      success: false,
      message: "Please Upload Profile Image",
    });
  }
  const checkEmail = await User.findOne({ email: req.body.email });
  if (checkEmail) {
    return res.status(400).json({
      success: false,
      message: "Plz Use another Email Id's",
    });
  }
  

  // Add the uniqueTestId to the req.body before creating the user
  req.body.testResult = [{ testId: 0 }];


  const user = await User.create(req.body);
  

  return res.status(201).json({
    success: true,
    data: user,
    message: "Registration Successfully",
  });
});

exports.updateStudent = asyncHandler(async (req, res, next) => {
  if (!req.body.image) {
    return res.status(400).json({
      success: false,
      message: "Please Upload Profile Image",
    });
  }
  await User.findByIdAndUpdate(req.params.studentId, req.body);
  return res.status(201).json({
    success: true,
    message: "Update Successfully",
  });
});

exports.deleteStudent = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.studentId);
  return res.status(201).json({
    success: true,
    message: "Delete Successfully",
  });
});

exports.getAllCertificate = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10, search } = req.query;

  // Define the search criteria
  const searchCriteria = {
    role: 'student',
    'testResult.0': { $exists: true },
    $or: [
      { name: { $regex: new RegExp(search, 'i') } },
      { email: { $regex: new RegExp(search, 'i') } },
    ],
  };

  // Count the total number of documents matching the search criteria
  const totalDataCount = await User.countDocuments(searchCriteria);

  // Implement pagination
  const options = {
    limit: parseInt(limit),
    skip: (parseInt(page) - 1) * parseInt(limit),
  };

  // Fetch the users based on the search criteria and pagination options
  const allStudent = await User.find(searchCriteria)
    .select('name email image certificate testResult')
    .lean()
    .limit(options.limit)
    .skip(options.skip);

  let finalArray = [];
  for await (let student of allStudent) {
    for (let result of student.testResult) {
      let certificate =student?.certificate && student?.certificate?.find((item)=>item.testId===result.testId)
      let tempOb={
        courseId: result.courseId,
        courseName: result.courseName,
        studentId: student._id,
        name: student.name,
        attemptCount: result.attemptCount,
        testId: result.testId,
        email:student.email,
        certificateLink:certificate?.certificateLink,
        isApproved:certificate?.isApproved,
        maxMark:result?.maxMark,
        cuttOffScore:result?.cuttOffScore,
        obtainedScore:result?.obtainedScore,
      };
      if (
        finalArray.some(
          (item) =>
            item.courseId.toString() === result.courseId.toString() &&
            student._id.toString() === item.studentId.toString()
        )
      ) {
        let existsIndex = finalArray.findIndex(
          (item) =>
          item.courseId.toString() === result.courseId.toString() &&
          student._id.toString() === item.studentId.toString()
        );
        if (finalArray[existsIndex].attemptCount < result.attemptCount) {
       
          finalArray[existsIndex] = tempOb;
        }
      } else {
        finalArray.push(tempOb);
      }
    }
  }

  const totalPages = Math.ceil(totalDataCount / parseInt(limit));

  return res.status(200).json({
    success: true,
    totalDataCount,
    currentPage: parseInt(page),
    totalPages,
    data: finalArray,
  });
});

exports.directUpdateResult = asyncHandler(async (req, res, next) => {
  let student=await User.findOne({_id:new mongoose.Types.ObjectId(req.body.studentId)});
  student.testResult?.map((item)=>{
    if(item.testId==req.body.testId){
       item.obtainedScore=req.body.obtainedScore;
       item.status="passed"
    }
  })
  await student.save();
  return res.status(201).json({
    success: true,
    message: "Update Result SuccessFully",
  });
});

exports.directUpdateCertificate = asyncHandler(async (req, res, next) => {
  let student=await User.findOne({_id:new mongoose.Types.ObjectId(req.body.studentId)});
  if(student.certificate.length){
    student.certificate.map((certficate)=>{
      if(certficate.testId==req.body.testId){
        certficate.certificateLink=req.body.certificateLink
        certficate.isApproved=req.body.isApproved
      }
    })

    student.testResult.map((result)=>{
      if(result.testId==req.body.testId){
        result.isApproved=req.body.isApproved
      }
    })
  }else{
    student.certificate.push(req.body)
  }
  await student.save();
  return res.status(201).json({
    student:student.certificate,
    success: true,
    message: "Update Certificate SuccessFully",
  });
});