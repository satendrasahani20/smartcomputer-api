const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { getCourses, addCourse, updateCourse } = require('../controller/admin');
const { getQuestions, addQuestion, updateQuestion, deleteQuestion } = require('../controller/admin/question');
const { getModules, updateModules, addModules } = require('../controller/admin/module');
router.get('/get-course', protect, getCourses);
router.post('/course', protect, addCourse);
router.put('/course/:id', protect, updateCourse);

router.get('/modules/:courseId', protect, getModules);

router.post('/modules', protect, addModules);
router.put('/modules/:id', protect, updateModules);
router.get('/questions/:moduleId', protect, getQuestions);

router.post('/questions/:moduleId', protect, addQuestion);
router.put('/questions/:moduleId/:questionId', protect, updateQuestion);
router.delete('/questions/:moduleId/:questionId',protect,deleteQuestion)
module.exports = router;