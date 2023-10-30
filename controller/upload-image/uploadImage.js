const asyncHandler = require("../../middleware/async");
const fs = require("fs");
const ImageKit = require("imagekit");
const imagekit = new ImageKit({
  publicKey: "public_d2Ro5kkNg9EFCoXyoctm+YQbfuM=",
  privateKey: "private_LrWU7CHikJcPobi2gxHTJH/5qZ4=",
  urlEndpoint: "https://ik.imagekit.io/bbnngj9wy/",
});
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.files.image) {
    return res.status(400).send("No file uploaded.");
  }

  const fileBuffer = fs.readFileSync(req.files.image.path); // Read the file and convert it to a buffer
  const result = await imagekit.upload({
    file: fileBuffer,
    fileName: req.files.image.name,
  });

 return res.status(200).json({ imageUrl: result.url });
});

exports.deleteImage = asyncHandler(async (req, res, next) => {
  try {
    const url = decodeURIComponent("https://ik.imagekit.io/bbnngj9wy/test-table_ZM2Sq1aE4.png");
    console.log("url",url)
    const result = await imagekit.deleteFile(url);

    if (result.statusCode === 204) {
      res.status(204).json({ message: 'Image deleted successfully' });
    } else if (result.statusCode === 404) {
      res.status(404).json({ error: 'Image not found' });
    } else {
      console.error(result);
      res.status(500).json({ error: 'Failed to delete image' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
})