const express = require('express');

const router = express.Router();

const { protect } = require('../middleware/auth');
const { createUser, getUsers } = require('../controller/users');

router.post('/register',protect, createUser);
router.post('/list',protect, getUsers);
module.exports = router;