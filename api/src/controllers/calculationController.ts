import { Request, Response } from 'express';
import { pricingFormSchema, PricingFormData } from '../schemas/pricingValidation.js';
import { simulate } from '../services/simulationService.js';
import { z } from 'zod';

export const simulatePricing = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedInputs: PricingFormData = pricingFormSchema.parse(req.body);

    const results = simulate(validatedInputs);

    res.status(200).json({
      success: true,
      message: 'Calculation completed successfully',
      data: validatedInputs,
      results: results,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation error
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues.map((err: z.ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    } else {
      // Other errors
      console.error('Error in simulatePricing:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
};
