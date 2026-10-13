import { Router } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import requireAuth from '../middleware/requireAuth';
import requireRole from '../middleware/requireRole';
import {
  listProjectRequests,
  createProjectRequest,
  getProjectRequest,
  decideProjectRequest,
  updateProjectRequestStatus,
} from '../controllers/requestController';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(listProjectRequests));
router.post('/', asyncHandler(createProjectRequest));
router.get('/:id', asyncHandler(getProjectRequest));
router.patch('/:id/decision', asyncHandler(decideProjectRequest));
router.patch('/:id/status', requireRole('pmo'), asyncHandler(updateProjectRequestStatus));

export default router;
