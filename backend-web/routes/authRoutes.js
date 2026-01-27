import { Hono } from 'hono';
import { register, login, verifyOTP, forgotPassword, resetPassword } from '../controllers/authController.js';

const auth = new Hono();

auth.post('/register', register);
auth.post('/login', login);
auth.post('/verify-otp', verifyOTP);
auth.post('/forgot-password', forgotPassword);
auth.post('/reset-password', resetPassword);

export default auth;
