import { Router } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import requireAuth from '../middleware/requireAuth';
import {
  listProjectRequests,
  createProjectRequest,
  getProjectRequest,
} from '../controllers/requestController';

const router = Router();

router.use(requireAuth);

router.get('/', asyncHandler(listProjectRequests));
router.post('/', asyncHandler(createProjectRequest));
router.get('/:id', asyncHandler(getProjectRequest));

export default router;
