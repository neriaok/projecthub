import { Router } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import requireAuth from '../middleware/requireAuth';
import { login, getMe } from '../controllers/authController';

const router = Router();

router.post('/login', asyncHandler(login));
router.get('/me', requireAuth, asyncHandler(getMe));

export default router;
