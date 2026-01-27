import { Hono } from 'hono';
import { getProfile } from '../controllers/userController.js';

const user = new Hono();

user.get('/profile/:username', getProfile);

export default user;
