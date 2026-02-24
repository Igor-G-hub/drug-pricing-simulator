export interface SimulatorInputs {
  pricingModel: 'initialResponse' | 'fixedDiscount';
  listPricePerAdministration: number;
  newPatientsPerMonth: number;
  averageTreatmentDuration: number;
  administrationsPerPatientPerMonth: number;
  timeHorizon: number;
  responseRateAfterMonth1: number;
  fixedDiscountRate: number;
}

export interface MonthResult {
  month: number;
  netRevenue: number;
  avgNetPricePerAdmin: number;
  percentDiscount: number;
  absoluteDiscount: number;
  adminCount: number;
}

function getActivePatients(
  currentMonth: number,
  inputs: SimulatorInputs,
  pricingModel: "initialResponse" | "fixedDiscount"
): { fullPayers: number; allAdmins: number } {
  const {
    newPatientsPerMonth,
    averageTreatmentDuration,
    administrationsPerPatientPerMonth,
    responseRateAfterMonth1,
  } = inputs;

  let fullPayers = 0; // patients paying list price this month
  let allAdmins = 0;  // total administrations this month (for avg price calc)

  // Iterate over every cohort that started on or before this month
  for (let startMonth = 1; startMonth <= currentMonth; startMonth++) {
    const monthsInTreatment = currentMonth - startMonth + 1;

    if (monthsInTreatment > averageTreatmentDuration) continue; // cohort finished

    const cohortSize = newPatientsPerMonth;

    if (pricingModel === "fixedDiscount") {
      // Everyone pays, no dropoff
      fullPayers += cohortSize;
      allAdmins  += cohortSize * administrationsPerPatientPerMonth;

    } else {
      // initialResponse
      if (monthsInTreatment === 1) {
        // Month 1: ALL patients get administered (we don't know responders yet)
        fullPayers += cohortSize;
        allAdmins  += cohortSize * administrationsPerPatientPerMonth;
      } else {
        // Month 2+: only responders remain
        const responders = cohortSize * responseRateAfterMonth1;
        fullPayers += responders;
        allAdmins  += responders * administrationsPerPatientPerMonth;
      }
    }
  }

  return { fullPayers, allAdmins };
}

function calcInitialResponse(inputs: SimulatorInputs): MonthResult[] {
  const { listPricePerAdministration, timeHorizon, administrationsPerPatientPerMonth } = inputs;
  const results: MonthResult[] = [];

  for (let month = 1; month <= timeHorizon; month++) {
    const { fullPayers, allAdmins } = getActivePatients(month, inputs, "initialResponse");

    // Revenue: only responders (and all month-1 patients) pay list price
    const netRevenue = fullPayers * administrationsPerPatientPerMonth * listPricePerAdministration;

    // allAdmins equals fullPayers * appm here because non-responders
    // simply aren't administered after month 1 — they dropped out.
    // So avgNetPrice = listPricePerAdministration (no price reduction occurred).
    //
    // BUT: the meaningful discount metric is vs "what would full list
    // for the full expected cohort have cost the payer?"
    // We calculate it against the ACTUAL admins that happened.
    const avgNetPricePerAdmin = allAdmins > 0 ? netRevenue / allAdmins : 0;

    // Discount relative to list price
    const percentDiscount = 1 - avgNetPricePerAdmin / listPricePerAdministration;
    const absoluteDiscount = listPricePerAdministration - avgNetPricePerAdmin;

    results.push({
      month,
      netRevenue,
      avgNetPricePerAdmin,
      percentDiscount,
      absoluteDiscount,
      adminCount: allAdmins,
    });
  }

  return results;
}

function calcFixedDiscount(inputs: SimulatorInputs): MonthResult[] {
  const { listPricePerAdministration, fixedDiscountRate, timeHorizon, administrationsPerPatientPerMonth } = inputs;
  const results: MonthResult[] = [];

  console.log('Fixed discount rate:', fixedDiscountRate);

  const netPricePerAdmin = listPricePerAdministration * (1 - fixedDiscountRate); // constant
  const percentDiscount  = fixedDiscountRate;                   // constant
  const absoluteDiscount = listPricePerAdministration - netPricePerAdmin;        // constant

  for (let month = 1; month <= timeHorizon; month++) {
    const { allAdmins } = getActivePatients(month, inputs, "fixedDiscount");

    const netRevenue = allAdmins * netPricePerAdmin;

    results.push({
      month,
      netRevenue,
      avgNetPricePerAdmin: netPricePerAdmin,
      percentDiscount,
      absoluteDiscount,
      adminCount: allAdmins,
    });
  }

  return results;
}

export function simulate(inputs: SimulatorInputs): MonthResult[] {
  if (inputs.pricingModel === "initialResponse") {
    return calcInitialResponse(inputs);
  }
  return calcFixedDiscount(inputs);
}
