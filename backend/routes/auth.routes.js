import express from 'express';
import {
    register,
    login,
    logout,
    sendVerifyOTP,
    verifyEmailOTP,
} from '../controllers/auth.controller.js';
import userAuth from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-otp', userAuth, sendVerifyOTP);
router.post('/verify-otp', userAuth, verifyEmailOTP);

export default router;
