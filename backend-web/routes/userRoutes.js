import { Hono } from 'hono';
import { getProfile, updateProfile } from '../controllers/userController.js';
import authenticateToken from '../middleware/authMiddleware.js';

const user = new Hono();

user.get('/profile/:username', getProfile);
user.put('/update', authenticateToken, updateProfile);

export default user;
