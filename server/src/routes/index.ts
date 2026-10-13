import { Router } from 'express';
import ensureDb from '../middleware/ensureDb';
import healthRoutes from './healthRoutes';
import authRoutes from './authRoutes';
import requestRoutes from './requestRoutes';

const router = Router();

router.use('/health', healthRoutes);

router.use(ensureDb);
router.use('/auth', authRoutes);
router.use('/requests', requestRoutes);

export default router;
