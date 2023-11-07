const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema({
  quardinator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  ownerImage:{ type: String },
  centreName: { type: String },
  ownerName: { type: String },
  password: { type: String },
  fatherName: { type: String },
  gender: { type: String },
  qualification: { type: String },
  adharNo: { type: String },
  state: { type: String },
  city: { type: String },
  address: { type: String },
  pincode: { type: String },
  number: { type: String },
  email: { type: String },
  centrePhoto: {
    inner: { type: String },
    outer: { type: String },
  },
  teacher: [
    {
      name: { type: String },
      email: { type: String },
      number: { type: String },
      qualification: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("centre", CourseSchema);
