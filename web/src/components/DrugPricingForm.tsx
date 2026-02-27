import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { validatePricingForm } from '../schemas/formValidation';
import type { PricingFormValues } from '../schemas/formValidation';
import { useResults } from '../context/ResultsContext';
import NumberInputField from './form/NumberInputField';
import RadioGroupField from './form/RadioGroupField';
import RangeSliderField from './form/RangeSliderField';
import { SimulationService } from '../services/SimulationService';

const TEST_LOADING_DELAY_MS = 300;

const initialValues: PricingFormValues = {
  pricingModel: 'initialResponse',
  listPricePerAdministration: 3500,
  newPatientsPerMonth: 100,
  averageTreatmentDuration: 4,
  administrationsPerPatientPerMonth: 2,
  timeHorizon: 12,
  responseRateAfterMonth1: 90, // Stored as percentage to user input(90% = 90)
  fixedDiscountRate: 15, // Stored as percentage to user input(15% = 15)
};

const DrugPricingForm: React.FC = () => {
  const { setResults, setIsLoading } = useResults();
  
  const formik = useFormik({
    initialValues,
    validate: validatePricingForm,
    onSubmit: (values) => {
      console.log('Form submitted:', values);
    },
  });

  const {
    pricingModel,
    listPricePerAdministration,
    newPatientsPerMonth,
    averageTreatmentDuration,
    administrationsPerPatientPerMonth,
    timeHorizon,
    responseRateAfterMonth1,
    fixedDiscountRate,
  } = formik.values;

  const getSimulationData = async () => {
    const formData = {
      pricingModel,
      listPricePerAdministration,
      newPatientsPerMonth,
      averageTreatmentDuration,
      administrationsPerPatientPerMonth,
      timeHorizon,
      responseRateAfterMonth1: responseRateAfterMonth1 ? responseRateAfterMonth1 / 100 : 0,
      fixedDiscountRate: fixedDiscountRate ? fixedDiscountRate / 100 : 0,
    };

    console.log('Form values changed:', formData);

    try {
      setIsLoading(true);
      const data = await SimulationService.simulate(formData);

      if (data.success && data.results) {
        console.log('API Response:', data);
        setResults(data.results);
      } else {
        console.error('API Error:', data);
        setResults([]);
      }
    } catch (error) {
      console.error('Failed to call API:', error);
      setResults([]);
    } finally {
      // Small artificial delay to make loading/transition states easy to validate visually.
      await new Promise((resolve) => setTimeout(resolve, TEST_LOADING_DELAY_MS));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only call API if there are no validation errors
      if (Object.keys(formik.errors).length === 0) {
        getSimulationData();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    pricingModel,
    listPricePerAdministration,
    newPatientsPerMonth,
    averageTreatmentDuration,
    administrationsPerPatientPerMonth,
    timeHorizon,
    responseRateAfterMonth1,
    fixedDiscountRate,
    formik.errors,
  ]);

  return (
    <div className="h-full p-6 bg-card rounded-lg border border-border">
      <h2 className="text-2xl font-semibold text-[#27baa0] mb-6">Adjust Parameters</h2>
      
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <RadioGroupField
          name="pricingModel"
          label="Pricing Model"
          value={formik.values.pricingModel}
          options={[
            { value: 'initialResponse', label: 'Initial Response' },
            { value: 'fixedDiscount', label: 'Fixed Discount' },
          ]}
          error={formik.touched.pricingModel ? formik.errors.pricingModel : undefined}
          onChangeValue={(value) => formik.setFieldValue('pricingModel', value)}
        />

        <NumberInputField
          id="listPricePerAdministration"
          name="listPricePerAdministration"
          label="List price per administration"
          value={formik.values.listPricePerAdministration}
          error={formik.errors.listPricePerAdministration}
          step="0.01"
          suffix="EUR"
          allowDecimals
          onChangeValue={(value) => formik.setFieldValue('listPricePerAdministration', value)}
        />

        <NumberInputField
          id="newPatientsPerMonth"
          name="newPatientsPerMonth"
          label="New patients per month"
          value={formik.values.newPatientsPerMonth}
          error={formik.errors.newPatientsPerMonth}
          step="1"
          onChangeValue={(value) => formik.setFieldValue('newPatientsPerMonth', value)}
        />

        <NumberInputField
          id="averageTreatmentDuration"
          name="averageTreatmentDuration"
          label="Average treatment duration (months)"
          value={formik.values.averageTreatmentDuration}
          error={formik.errors.averageTreatmentDuration}
          step="1"
          onChangeValue={(value) => formik.setFieldValue('averageTreatmentDuration', value)}
        />

        <NumberInputField
          id="administrationsPerPatientPerMonth"
          name="administrationsPerPatientPerMonth"
          label="Administrations per patient per month"
          value={formik.values.administrationsPerPatientPerMonth}
          error={formik.errors.administrationsPerPatientPerMonth}
          step="1"
          onChangeValue={(value) => formik.setFieldValue('administrationsPerPatientPerMonth', value)}
        />

        <RangeSliderField
          id="timeHorizon"
          name="timeHorizon"
          label="Time horizon"
          value={formik.values.timeHorizon}
          min={4}
          max={24}
          unit="months"
          error={formik.touched.timeHorizon ? formik.errors.timeHorizon : undefined}
          onCommitValue={(value) => formik.setFieldValue('timeHorizon', value)}
        />

        <NumberInputField
          id="responseRateAfterMonth1"
          name="responseRateAfterMonth1"
          label="Initial Response (Response rate after month 1)"
          value={formik.values.responseRateAfterMonth1}
          error={formik.errors.responseRateAfterMonth1}
          step="0.01"
          suffix="%"
          allowDecimals
          max={100}
          disabled={formik.values.pricingModel === 'fixedDiscount'}
          onChangeValue={(value) => formik.setFieldValue('responseRateAfterMonth1', value)}
        />

        <NumberInputField
          id="fixedDiscountRate"
          name="fixedDiscountRate"
          label="Fixed discount rate"
          value={formik.values.fixedDiscountRate}
          error={formik.errors.fixedDiscountRate}
          step="0.01"
          suffix="%"
          allowDecimals
          max={100}
          disabled={formik.values.pricingModel === 'initialResponse'}
          onChangeValue={(value) => formik.setFieldValue('fixedDiscountRate', value)}
        />

        {/* Development: Display Formik State */}
        {/* <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Formik State (Dev)</h3>
          <pre className="text-xs text-gray-800 overflow-auto max-h-60">
            {JSON.stringify({ values: formik.values, errors: formik.errors }, null, 2)}
          </pre>
        </div> */}
      </form>
    </div>
  );
};
    
export default DrugPricingForm;
