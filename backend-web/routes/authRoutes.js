import { Hono } from 'hono';
import { register, login, verifyOTP } from '../controllers/authController.js';

const auth = new Hono();

auth.post('/register', register);
auth.post('/login', login);
auth.post('/verify-otp', verifyOTP);

export default auth;
