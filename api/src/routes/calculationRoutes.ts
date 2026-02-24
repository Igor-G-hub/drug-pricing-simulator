import { Router } from 'express';
import { calculatePricing } from '../controllers/calculationController.js';

const router = Router();

// POST /api/calculate
router.post('/calculate', calculatePricing);

export default router;
