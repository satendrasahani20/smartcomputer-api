// const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const user = await User.find();
  return res.status(200).json({data:user});
});

// @desc      Get single user
// @route     GET /api/v1/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if(!user){
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
exports.createUser = asyncHandler(async (req, res, next) => {
  if(!req.body.image){
    return res.status(400).json({
      success: false,
      message: "Please Upload Profile Image"
    });
  }
  if(!req.body.adharCardFront){
    return res.status(400).json({
      success: false,
      message: "Please Front Image of Adhar"
    });
  }
  if(!req.body.adharCardBack){
    return res.status(400).json({
      success: false,
      message: "Please Back Image of Adhar"
    });
  }
  const checkEmail=await User.findOne({email:req.body.email})
  if(checkEmail){
      return res.status(400).json({
        success: false,
        message: "Plz Use another Email Id's"
      });
  }
  const user = await User.create(req.body);

 return res.status(201).json({
    success: true,
    data: user,
    message:"Registration Successfully"
  });
});

// @desc      Update user
// @route     PUT /api/v1/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});