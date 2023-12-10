const express = require('express');
const { uploadImage, deleteImage } = require('../controller/upload-image/uploadImage');
const { getCertificate } = require('../controller/users');
const router = express.Router();

router.post('/upload-image', uploadImage);
router.delete('/image/', deleteImage);
router.get('/get-certificate/:testId', getCertificate);
module.exports = router;