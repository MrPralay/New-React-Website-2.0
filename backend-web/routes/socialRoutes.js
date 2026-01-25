const express = require('express');
const { getFeed, createPost } = require('../controllers/socialController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/feed', getFeed);
router.post('/posts', authenticateToken, createPost);

module.exports = router;
