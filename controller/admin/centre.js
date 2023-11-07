const Centre = require("../../models/Centre");
const asyncHandler = require("../../middleware/async");

exports.registerCentre = asyncHandler(async (req, res, next) => {
  if (!req.body.ownerImage) {
    return res.status(400).json({
      success: false,
      message: "Please Upload Profile Image",
    });
  }
  if (!req.body.centrePhoto.inner) {
    return res.status(400).json({
      success: false,
      message: "Please Upload Front Image of Centre",
    });
  }
  if (!req.body.centrePhoto.outer) {
    return res.status(400).json({
      success: false,
      message: "Please Upload Back Image of Centre",
    });
  }
  const checkEmail = await Centre.findOne({ email: req.body.email });
  if (checkEmail) {
    return res.status(400).json({
      success: false,
      message: "Plz Use another Email Id's",
    });
  }
  const user = await Centre.create(req.body);

  return res.status(201).json({
    success: true,
    data: user,
    message: "Registration Successfully",
  });
});
exports.getCentre = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Current page (default: 1)
  const perPage = parseInt(req.query.perPage) || 10; // Items per page (default: 10)
  const searchTerm = req.query.search;

  // Define the aggregation pipeline
  const pipeline = [
    {
      $match: {
        $or: [
          { centreName: { $regex: searchTerm, $options: "i" } },
          { ownerName: { $regex: searchTerm, $options: "i" } },
          { address: { $regex: searchTerm, $options: "i" } },
          { pincode: { $regex: searchTerm, $options: "i" } },
          // { quardinator: new mongoose.Types.ObjectId(searchTerm) },
        ],
      },
    },
  ];

  let totalDataCount = await Centre.aggregate(pipeline).count("studentCount");

  // Perform pagination using $skip and $limit
  const skip = (page - 1) * perPage;
  pipeline.push({ $skip: skip }, { $limit: perPage });

  // Execute the aggregation
  const studentsByCourse = await Centre.aggregate(pipeline);
  totalDataCount = totalDataCount?.[0]?.studentCount;

  // Calculate the total number of pages
  const totalPages = Math.ceil(totalDataCount / perPage);

  // Create the response object
  const response = {
    data: studentsByCourse, // The search results
    totalDataCount, // Total count of matching documents
    totalPages, // Total number of pages
    currentPage: page,
  };

  return res.json(response);
});
exports.updateCentre = asyncHandler(async (req, res, next) => {
  if (!req.body.ownerImage) {
    return res.status(400).json({
      success: false,
      message: "Please Upload Profile Image",
    });
  }
  if (!req.body.centrePhoto.inner) {
    return res.status(400).json({
      success: false,
      message: "Please Upload Front Image of Centre",
    });
  }
  if (!req.body.centrePhoto.outer) {
    return res.status(400).json({
      success: false,
      message: "Please Upload Back Image of Centre",
    });
  }
  await Centre.findByIdAndUpdate(req.params.centreId, req.body);
  return res.status(201).json({
    success: true,
    message: "Update Successfully",
  });
});

exports.deleteCentre = asyncHandler(async (req, res, next) => {
  await Centre.findByIdAndDelete(req.params.centreId);
  return res.status(201).json({
    success: true,
    message: "Delete Successfully",
  });
});
