import { z } from 'zod';

// Zod validation schema for pricing form (same as frontend)
export const pricingFormSchema = z.object({
  pricingModel: z.enum(['initialResponse', 'fixedDiscount']),
  listPricePerAdministration: z.number().min(0, 'Must be a positive number'),
  newPatientsPerMonth: z.number().min(0, 'Must be a positive number'),
  averageTreatmentDuration: z.number().min(1, 'Must be at least 1 month'),
  administrationsPerPatientPerMonth: z.number().min(1, 'Must be at least 1'),
  timeHorizon: z.number().min(4, 'Must be at least 4 months').max(24, 'Must be at most 24 months'),
  responseRateAfterMonth1: z.number().min(0, 'Must be between 0 and 1').max(1, 'Must be between 0 and 1'),
  fixedDiscountRate: z.number().min(0, 'Must be between 0 and 1').max(1, 'Must be between 0 and 1'),
});

export type PricingFormData = z.infer<typeof pricingFormSchema>;
