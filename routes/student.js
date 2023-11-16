const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { getCourses, startTest, saveResult, updateActivity } = require('../controller/student/course');

// centre
router.get('/course',protect, getCourses);
router.get('/start-test/:courseId',protect, startTest);
router.post('/result/',protect, saveResult);

router.put('/test-activity/',protect, updateActivity);
module.exports = router;