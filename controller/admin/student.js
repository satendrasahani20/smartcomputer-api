// const ErrorResponse = require('../utils/errorResponse');
const { default: mongoose } = require("mongoose");
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
  if (req.user.role == 'quardinate' || req.user.role == 'centre') {
    pipeline.push({
      $match: {
        "registerBy._id":req.user._id,
      }
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
    data=studentsByCourse;
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
