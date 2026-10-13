import { Router } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import requireAuth from '../middleware/requireAuth';
import requireRole from '../middleware/requireRole';
import { getDashboardSummary } from '../controllers/dashboardController';

const router = Router();

router.get('/summary', requireAuth, requireRole('pmo'), asyncHandler(getDashboardSummary));

export default router;
