import express from 'express';
import {
    register,
    login,
    logout,
    sendVerifyOTP,
    verifyEmailOTP,
    isAuthenticated,
    sendResetPasswordOTP,
    verifyResetPasswordOTP,
} from '../controllers/auth.controller.js';
import userAuth from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-otp', userAuth, sendVerifyOTP);
router.post('/verify-otp', userAuth, verifyEmailOTP);
router.get('/is-auth', userAuth, isAuthenticated);
router.post('/reset-otp', sendResetPasswordOTP);
router.post('/reset-pass', verifyResetPasswordOTP);

export default router;
