// const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const jwt = require('jsonwebtoken');


// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public


exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  user.save({ validateBeforeSave: false });
});


// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate emil & password
  if (!email || !password) {
    return res.status(400).json({message:"Please provide an email and password"})
    // return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('password email image role');


  if (!user) {
    return res.status(400).json({message:"Invalid credentials"})
    // return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  // const isMatch = await user.matchPassword(password);
  const isMatch=password===user.password

  if (!isMatch) {
    return res.status(400).json({message:"Invalid credentials"})
    // return next(new ErrorResponse('Invalid credentials', 401));
  }
  const tempUser={
    _id:user._id,
    role:user.role,
    image:user.image,
    name:user.name
  }
  const token=jwt.sign(tempUser,process.env.JWT_SECRET_KEY,{
    expiresIn:process.env.JWT_EXPIRE
  })
 return res.status(200).json({
    token,
    role:user.role
  })

});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getUser = asyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  const user = req.user;

  res.status(200).json({
    success: true,
    data: user,
  });
});

