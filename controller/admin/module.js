const { mongoose } = require("mongoose");
const Module = require("../../models/Module");
const asyncHandler = require("../../middleware/async");

exports.getModules = asyncHandler(async (req, res, next) => {
  const courseId = req.params.courseId;
  const limit = parseInt(req.query.limit); // Set default limit
  const page = parseInt(req.query.page); // Set default page

  const skip = (page - 1) * limit;

  const pipeline = [
    {
      $match: { courseId: new mongoose.Types.ObjectId(courseId) }, // Filter by courseId
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $project: {
        _id: 1,
        courseId: 1,
        moduleName: 1,
        content: 1,
        noOfQuestion: { $size: "$questions" },
      },
    },
  ];

  const modules = await Module.aggregate(pipeline);

  // Count total data
  const totalDataCount = await Module.countDocuments({ courseId });

  // Calculate total pages
  const totalPages = Math.ceil(totalDataCount / limit);

  res.json({
    data: modules,
    totalDataCount,
    totalPages,
    currentPage: page,
  });
});
exports.updateModules = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await Module.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id) },
    req.body
  );
  return res.status(200).json({
    success: true,
    data: result,
  });
});
exports.addModules = asyncHandler(async (req, res, next) => {
    const result = await Module.create(req.body);
    return res.status(200).json({
      success: true,
      data: result,
    });
  });
  