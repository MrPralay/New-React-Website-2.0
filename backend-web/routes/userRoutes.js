const express = require('express');
const { getProfile } = require('../controllers/userController');

const router = express.Router();

router.get('/profile/:username', getProfile);

module.exports = router;
