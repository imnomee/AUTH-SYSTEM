import express from 'express';
import userAuth from '../middlewares/auth.middleware.js';
import { getUserData } from '../controllers/user.controller.js';

const router = express.Router();
router.get('/data', userAuth, getUserData);
export default router;
