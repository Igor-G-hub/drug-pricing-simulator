import { z } from 'zod';

// Helper function to check decimal places
const hasMaxTwoDecimals = (num: number): boolean => {
  if (isNaN(num)) return false;
  const decimalPart = num.toString().split('.')[1];
  return !decimalPart || decimalPart.length <= 2;
};

// Zod validation schema for pricing form
export const pricingFormSchema = z.object({
  pricingModel: z.enum(['initialResponse', 'fixedDiscount']),
  listPricePerAdministration: z.number()
    .refine((val) => !isNaN(val), 'Value must be inserted')
    .refine((val) => val > 0, 'Must be a positive number')
    .refine(hasMaxTwoDecimals, 'Maximum 2 decimal places allowed'),
  newPatientsPerMonth: z.number()
    .refine((val) => !isNaN(val), 'Value must be inserted')
    .refine((val) => val >= 0, 'Must be a positive number'),
  averageTreatmentDuration: z.number()
    .refine((val) => !isNaN(val), 'Value must be inserted')
    .refine((val) => val >= 1, 'Must be at least 1 month'),
  administrationsPerPatientPerMonth: z.number()
    .refine((val) => !isNaN(val), 'Value must be inserted')
    .refine((val) => val >= 1, 'Must be at least 1'),
  timeHorizon: z.number().min(4, 'Must be at least 4 months').max(24, 'Must be at most 24 months'),
  responseRateAfterMonth1: z.union([
    z.number()
      .min(0, 'Must be between 0 and 100')
      .max(100, 'Must be between 0 and 100')
      .refine(hasMaxTwoDecimals, 'Maximum 2 decimal places allowed'),
    z.nan()
  ]).optional(),
  fixedDiscountRate: z.union([
    z.number()
      .min(0, 'Must be between 0 and 100')
      .max(100, 'Must be between 0 and 100')
      .refine(hasMaxTwoDecimals, 'Maximum 2 decimal places allowed'),
    z.nan()
  ]).optional(),
});

export type PricingFormValues = z.infer<typeof pricingFormSchema>;

// Validation function
export const validatePricingForm = (values: PricingFormValues) => {
  try {
    pricingFormSchema.parse(values);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues.reduce((acc: Record<string, string>, curr) => {
        const path = curr.path.join('.');
        // Custom error message for NaN values
        if ((path === 'listPricePerAdministration' || 
             path === 'newPatientsPerMonth' || 
             path === 'averageTreatmentDuration' || 
             path === 'administrationsPerPatientPerMonth') && 
            curr.code === 'invalid_type') {
          acc[path] = 'Value must be inserted';
        } else {
          acc[path] = curr.message;
        }
        return acc;
      }, {} as Record<string, string>);
    }
    return {};
  }
};
