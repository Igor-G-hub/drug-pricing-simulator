import type { MonthResult } from '../context/ResultsContext';

export interface SimulationRequestData {
  pricingModel: 'initialResponse' | 'fixedDiscount';
  listPricePerAdministration: number;
  newPatientsPerMonth: number;
  averageTreatmentDuration: number;
  administrationsPerPatientPerMonth: number;
  timeHorizon: number;
  responseRateAfterMonth1: number;
  fixedDiscountRate: number;
}

interface SimulationResponse {
  success: boolean;
  results?: MonthResult[];
  message?: string;
}

export class SimulationService {
  static async simulate(formData: SimulationRequestData): Promise<SimulationResponse> {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const response = await fetch(`${apiUrl}/api/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    return response.json();
  }
}
