const { default: mongoose } = require("mongoose");
const asyncHandler = require("../middleware/async");
const Course = require("../models/Course");
const Module = require("../models/Module");

exports.getCourses = asyncHandler(async (req, res, next) => {
  let { limit, page } = req.query; // Change this to the desired page size
  limit = parseInt(limit);
  page = parseInt(page);
  const totalDataCount = await Course.countDocuments();
  const totalPages = Math.ceil(totalDataCount / limit);
  const result = await Course.aggregate([
    {
      $lookup: {
        from: "modules",
        localField: "_id",
        foreignField: "courseId",
        as: "modules",
      },
    },
    {
      $addFields: {
        name: "$name",
        moduleNo: { $size: "$modules" },
        noOfQuestion: {
          $reduce: {
            input: "$modules",
            initialValue: 0,
            in: {
              $add: [
                "$$value",
                {
                  $size: {
                    $filter: {
                      input: "$$this.questions",
                      as: "question",
                      cond: { $ifNull: ["$$question.answer", false] },
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        modules: 0,
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit,
    },
  ]);
  res.status(200).json({
    success: true,
    data: result,
    totalDataCount,
    totalPages,
    currentPage: page,
  });
});
exports.addCourse = asyncHandler(async (req, res, next) => {
  const result = await Course.create(req.body);
  return res.status(200).json({
    success: true,
    data: result,
  });
});
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const result = await Course.findOneAndUpdate({ _id: id }, req.body);
  return res.status(200).json({
    success: true,
    data: result,
  });
});

