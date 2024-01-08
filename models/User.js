const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const randomize = require("randomatic");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  image: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    enum: ["student", "admin", "centre", "quardinate"],
    default: "student",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  fatherName: {
    type: String,
    default: "",
  },
  motherName: {
    type: String,
    default: "",
  },
  number: {
    type: String,
    default: "",
  },
  dateOfBirth: {
    type: Date,
    default: new Date(),
  },
  gender: {
    type: String,
    default: "",
  },
  userState: {
    type: String,
    default: "",
  },
  userCity: {
    type: String,
    default: "",
  },
  userCourse: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
    },
  ],
  userAddress: {
    type: String,
    default: "",
  },
  userPincode: {
    type: String,
    default: "",
  },
  userQualification: {
    type: String,
    default: "",
  },
  adharCardFront: {
    type: String,
    default: "",
  },
  adharCardBack: {
    type: String,
    default: "",
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
  confirmEmailToken: String,
  isEmailConfirmed: {
    type: Boolean,
    default: false,
  },
  twoFactorCode: String,
  twoFactorCodeExpire: Date,
  twoFactorEnable: {
    type: Boolean,
    default: false,
  },
  testActivity: {
    startTime: {
      type: Date,
      default: Date.now,
    },
    lastQuestionNo: {
      type: Number,
      default: 0,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
    },
    noOfAllQuestion: {
      type: Number,
      default: 0,
    },
    answer: {
      type: Array,
      default: [],
    },
  },
  testResult: {
    type:[
      {
        isApproved:{
          type: Boolean,
          default: false,
        },
        attemptCount: {
          type: Number,
          default: 0,
        },
        attemptAt: {
          type: Date,
          default: Date.now,
        },
        testId:{
          type: String,
          unique: false,
          default: "",
        },
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "course",
        },
        courseName: {
          type: String,
          default: "",
        },
        maxMark: {
          type: Number,
          default: 0,
        },
        cuttOffScore: {
          type: Number,
          default: 0,
        },
        obtainedScore: {
          type: Number,
          default: 0,
        },
        status: {
          type: String,
          default: "",
        },
      },
    ],

    default:[]
  },
  registerBy: {
    name: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "",
    },
    _id: {
      type: String,
      default: "",
    },
  },
  certificate: [{
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
    },
    testId: {
      type: String,
      default: "",
    },
    isApproved:{
      type: Boolean,
      default: false,
    },
    certificateLink:{
      type: String,
      default: "",
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("users", UserSchema);
