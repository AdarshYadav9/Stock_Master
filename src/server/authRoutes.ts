import express, { Router } from 'express';
import { signup, login, requestOTP, resetPassword } from './authController';

const router: Router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/request-otp', requestOTP);
router.post('/reset-password', resetPassword);

export default router;

