import { Router } from 'express';
import ensureDb from '../middleware/ensureDb';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';
import requestRoutes from './requestRoutes';
import dashboardRoutes from './dashboardRoutes';

const router = Router();

router.use('/health', healthRoutes);

router.use(ensureDb);
router.use('/auth', authRoutes);
router.use('/requests', requestRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
