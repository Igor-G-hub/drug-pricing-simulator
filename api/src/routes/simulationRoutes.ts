import { Router } from 'express';
import { simulatePricing } from '../controllers/calculationController.js';

const router = Router();

// POST /api/simulate
router.post('/simulate', simulatePricing);

export default router;
