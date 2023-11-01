const express = require('express');
const { uploadImage, deleteImage } = require('../controller/upload-image/uploadImage');
const router = express.Router();

router.post('/upload-image', uploadImage);
router.delete('/image/', deleteImage);
module.exports = router;