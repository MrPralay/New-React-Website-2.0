import { Hono } from 'hono';
import { getFeed, createPost } from '../controllers/socialController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const social = new Hono();

social.get('/feed', getFeed);
social.post('/posts', authenticateToken, createPost);

export default social;
