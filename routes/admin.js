const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { getCourses, addCourse, updateCourse } = require('../controller/admin');
const { getQuestions, addQuestion, updateQuestion, deleteQuestion } = require('../controller/admin/question');
const { getModules, updateModules, addModules } = require('../controller/admin/module');
const { registerStudent, getStudentLists, updateStudent, deleteStudent, getAllCertificate, directUpdateResult, directUpdateCertificate } = require('../controller/admin/student');
const { registerCentre, getCentre, updateCentre, deleteCentre } = require('../controller/admin/centre');
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


//student

router.post('/student/register',protect, registerStudent);
router.put('/student/update/:studentId',protect, updateStudent);
router.get('/student/lists',protect, getStudentLists);
router.delete('/student/:studentId',protect, deleteStudent);
router.get("/get-all-certificate",protect,getAllCertificate)


// centre
router.post('/centre',protect, registerCentre);
router.get('/centre',protect, getCentre);
router.put('/centre/:centreId',protect, updateCentre);
router.delete('/centre/:centreId',protect, deleteCentre);


// result
router.put("/update-result",protect,directUpdateResult)
router.put("/update-certificate",protect,directUpdateCertificate)


module.exports = router;