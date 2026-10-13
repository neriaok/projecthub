import { Router } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import { getHealth } from '../controllers/healthController';

const router = Router();

router.get('/', asyncHandler(getHealth));

export default router;
