import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { validatePricingForm } from '../schemas/formValidation';
import type { PricingFormValues } from '../schemas/formValidation';
import { useResults } from '../context/ResultsContext';

const initialValues: PricingFormValues = {
  pricingModel: 'initialResponse',
  listPricePerAdministration: 3500,
  newPatientsPerMonth: 100,
  averageTreatmentDuration: 4,
  administrationsPerPatientPerMonth: 2,
  timeHorizon: 12,
  responseRateAfterMonth1: 0.90, // Stored as decimal (90% = 0.90)
  fixedDiscountRate: 0.15, // Stored as decimal (15% = 0.15)
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

  const getCalculationData = async () => {
    const formData = {
      pricingModel,
      listPricePerAdministration,
      newPatientsPerMonth,
      averageTreatmentDuration,
      administrationsPerPatientPerMonth,
      timeHorizon,
      responseRateAfterMonth1,
      fixedDiscountRate,
    };

    console.log('Form values changed:', formData);

    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getCalculationData();
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
  ]);

  return (
    <div className="h-full p-6 bg-card rounded-lg border border-border">
      <h2 className="text-2xl font-semibold text-card-foreground mb-6">Pricing Model Form</h2>
      
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Pricing Model Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Pricing Model
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="pricingModel"
                value="initialResponse"
                checked={formik.values.pricingModel === 'initialResponse'}
                onChange={formik.handleChange}
                className="w-4 h-4 text-primary border-input focus:ring-2 focus:ring-ring"
              />
              <span className="text-sm text-foreground">Initial Response</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="pricingModel"
                value="fixedDiscount"
                checked={formik.values.pricingModel === 'fixedDiscount'}
                onChange={formik.handleChange}
                className="w-4 h-4 text-primary border-input focus:ring-2 focus:ring-ring"
              />
              <span className="text-sm text-foreground">Fixed Discount</span>
            </label>
          </div>
          {formik.errors.pricingModel && formik.touched.pricingModel && (
            <p className="text-sm text-red-500">{formik.errors.pricingModel}</p>
          )}
        </div>

        {/* List Price per Administration */}
        <div className="space-y-2">
          <label htmlFor="listPricePerAdministration" className="block text-sm font-medium text-foreground">
            List price per administration
          </label>
          <div className="relative">
            <input
              id="listPricePerAdministration"
              name="listPricePerAdministration"
              type="number"
              step="0.01"
              value={formik.values.listPricePerAdministration}
              onInput={(e) => {
                const input = e.currentTarget.value;
                const decimalParts = input.split('.');
                
                if (decimalParts.length > 1 && decimalParts[1].length > 2) {
                  e.currentTarget.value = formik.values.listPricePerAdministration.toString();
                  return;
                }
                
                const value = parseFloat(input);
                
                if (!isNaN(value) && value < 0) {
                  e.currentTarget.value = formik.values.listPricePerAdministration.toString();
                  return;
                }
                
                if (!isNaN(value)) {
                  formik.setFieldValue('listPricePerAdministration', value);
                } else if (input === '') {
                  formik.setFieldValue('listPricePerAdministration', 0);
                }
              }}
              className="w-full px-3 py-2 pr-12 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              EUR
            </span>
          </div>
          {formik.errors.listPricePerAdministration && formik.touched.listPricePerAdministration && (
            <p className="text-sm text-red-500">{formik.errors.listPricePerAdministration}</p>
          )}
        </div>

        {/* New Patients per Month */}
        <div className="space-y-2">
          <label htmlFor="newPatientsPerMonth" className="block text-sm font-medium text-foreground">
            New patients per month
          </label>
          <input
            id="newPatientsPerMonth"
            name="newPatientsPerMonth"
            type="number"
            step="1"
            value={formik.values.newPatientsPerMonth}
            onKeyDown={(e) => {
              if (e.key === '.' || e.key === ',' || e.key === '-' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const input = e.target.value;
              const value = parseInt(input);
              
              if (!isNaN(value) && value >= 0) {
                formik.setFieldValue('newPatientsPerMonth', value);
              } else if (input === '') {
                formik.setFieldValue('newPatientsPerMonth', 0);
              }
            }}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {formik.errors.newPatientsPerMonth && formik.touched.newPatientsPerMonth && (
            <p className="text-sm text-red-500">{formik.errors.newPatientsPerMonth}</p>
          )}
        </div>

        {/* Average Treatment Duration */}
        <div className="space-y-2">
          <label htmlFor="averageTreatmentDuration" className="block text-sm font-medium text-foreground">
            Average treatment duration (months)
          </label>
          <input
            id="averageTreatmentDuration"
            name="averageTreatmentDuration"
            type="number"
            step="1"
            value={formik.values.averageTreatmentDuration}
            onKeyDown={(e) => {
              if (e.key === '.' || e.key === ',' || e.key === '-' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const input = e.target.value;
              const value = parseInt(input);
              
              if (!isNaN(value) && value >= 0) {
                formik.setFieldValue('averageTreatmentDuration', value);
              } else if (input === '') {
                formik.setFieldValue('averageTreatmentDuration', 0);
              }
            }}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {formik.errors.averageTreatmentDuration && formik.touched.averageTreatmentDuration && (
            <p className="text-sm text-red-500">{formik.errors.averageTreatmentDuration}</p>
          )}
        </div>

        {/* Administrations per Patient per Month */}
        <div className="space-y-2">
          <label htmlFor="administrationsPerPatientPerMonth" className="block text-sm font-medium text-foreground">
            Administrations per patient per month
          </label>
          <input
            id="administrationsPerPatientPerMonth"
            name="administrationsPerPatientPerMonth"
            type="number"
            step="1"
            value={formik.values.administrationsPerPatientPerMonth}
            onKeyDown={(e) => {
              if (e.key === '.' || e.key === ',' || e.key === '-' || e.key === 'e' || e.key === 'E') {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const input = e.target.value;
              const value = parseInt(input);
              
              if (!isNaN(value) && value >= 0) {
                formik.setFieldValue('administrationsPerPatientPerMonth', value);
              } else if (input === '') {
                formik.setFieldValue('administrationsPerPatientPerMonth', 0);
              }
            }}
            className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          {formik.errors.administrationsPerPatientPerMonth && formik.touched.administrationsPerPatientPerMonth && (
            <p className="text-sm text-red-500">{formik.errors.administrationsPerPatientPerMonth}</p>
          )}
        </div>

        {/* Time Horizon Slider */}
        <div className="space-y-2">
          <label htmlFor="timeHorizon" className="block text-sm font-medium text-foreground">
            Time horizon: {formik.values.timeHorizon} months
          </label>
          <input
            id="timeHorizon"
            name="timeHorizon"
            type="range"
            min="4"
            max="24"
            value={formik.values.timeHorizon}
            onChange={(e) => formik.setFieldValue('timeHorizon', parseInt(e.target.value))}
            style={{
              background: '#d1d5db',
            }}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>4 months</span>
            <span>24 months</span>
          </div>
          {formik.errors.timeHorizon && formik.touched.timeHorizon && (
            <p className="text-sm text-red-500">{formik.errors.timeHorizon}</p>
          )}
        </div>

        {/* Response Rate after Month 1 */}
        <div className="space-y-2">
          <label htmlFor="responseRateAfterMonth1" className="block text-sm font-medium text-foreground">
            Initial Response (Response rate after month 1)
          </label>
          <div className="relative">
            <input
              id="responseRateAfterMonth1"
              name="responseRateAfterMonth1"
              type="number"
              step="0.01"
              value={(formik.values.responseRateAfterMonth1 * 100).toFixed(2).replace(/\.?0+$/, '')}
              disabled={formik.values.pricingModel === 'fixedDiscount'}
              onInput={(e) => {
                const input = e.currentTarget.value;
                const decimalParts = input.split('.');
                
                if (decimalParts.length > 1 && decimalParts[1].length > 2) {
                  e.currentTarget.value = (formik.values.responseRateAfterMonth1 * 100).toFixed(2).replace(/\.?0+$/, '');
                  return;
                }
                
                const value = parseFloat(input);
                
                if (!isNaN(value) && (value > 100 || value < 0)) {
                  e.currentTarget.value = (formik.values.responseRateAfterMonth1 * 100).toFixed(2).replace(/\.?0+$/, '');
                  return;
                }
                
                if (!isNaN(value)) {
                  formik.setFieldValue('responseRateAfterMonth1', value / 100);
                } else if (input === '') {
                  formik.setFieldValue('responseRateAfterMonth1', 0);
                }
              }}
              className="w-full px-3 py-2 pr-12 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
          {formik.errors.responseRateAfterMonth1 && formik.touched.responseRateAfterMonth1 && (
            <p className="text-sm text-red-500">{formik.errors.responseRateAfterMonth1}</p>
          )}
        </div>

        {/* Fixed Discount Rate */}
        <div className="space-y-2">
          <label htmlFor="fixedDiscountRate" className="block text-sm font-medium text-foreground">
            Fixed discount rate
          </label>
          <div className="relative">
            <input
              id="fixedDiscountRate"
              name="fixedDiscountRate"
              type="number"
              step="0.01"
              value={(formik.values.fixedDiscountRate * 100).toFixed(2).replace(/\.?0+$/, '')}
              disabled={formik.values.pricingModel === 'initialResponse'}
              onInput={(e) => {
                const input = e.currentTarget.value;
                const decimalParts = input.split('.');
                
                if (decimalParts.length > 1 && decimalParts[1].length > 2) {
                  e.currentTarget.value = (formik.values.fixedDiscountRate * 100).toFixed(2).replace(/\.?0+$/, '');
                  return;
                }
                
                const value = parseFloat(input);
                
                if (!isNaN(value) && (value > 100 || value < 0)) {
                  e.currentTarget.value = (formik.values.fixedDiscountRate * 100).toFixed(2).replace(/\.?0+$/, '');
                  return;
                }
                
                if (!isNaN(value)) {
                  formik.setFieldValue('fixedDiscountRate', value / 100);
                } else if (input === '') {
                  formik.setFieldValue('fixedDiscountRate', 0);
                }
              }}
              className="w-full px-3 py-2 pr-12 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              %
            </span>
          </div>
          {formik.errors.fixedDiscountRate && formik.touched.fixedDiscountRate && (
            <p className="text-sm text-red-500">{formik.errors.fixedDiscountRate}</p>
          )}
        </div>

        {/* Development: Display Formik State */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Formik State (Dev)</h3>
          <pre className="text-xs text-gray-800 overflow-auto max-h-60">
            {JSON.stringify(formik.values, null, 2)}
          </pre>
        </div>
      </form>
    </div>
  );
};

export default DrugPricingForm;
