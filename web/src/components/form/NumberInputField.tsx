import React from 'react';
import FormFieldShell from './FormFieldShell';

type NumberInputFieldProps = {
  id: string;
  name: string;
  label: string;
  value: number | undefined;
  error?: string;
  disabled?: boolean;
  step?: string;
  suffix?: string;
  max?: number;
  allowDecimals?: boolean;
  onChangeValue: (value: number) => void;
};

const NumberInputField: React.FC<NumberInputFieldProps> = ({
  id,
  name,
  label,
  value,
  error,
  disabled = false,
  step = '1',
  suffix,
  max,
  allowDecimals = false,
  onChangeValue,
}) => {
  return (
    <FormFieldShell label={label} htmlFor={id} error={error}>
      <div className="relative">
        <input
          id={id}
          name={name}
          type="number"
          step={step}
          value={value === undefined || Number.isNaN(value) ? '' : value}
          disabled={disabled}
          onChange={(e) => {
            const input = e.target.value;

            if (input === '') {
              onChangeValue(Number.NaN);
              return;
            }

            const parsed = allowDecimals ? parseFloat(input) : parseInt(input, 10);

            if (!Number.isNaN(parsed)) {
              if (typeof max === 'number' && parsed > max) return;
              onChangeValue(parsed);
            } else {
              onChangeValue(Number.NaN);
            }
          }}
          className={`w-full px-3 py-2 border border-input rounded-md bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#27baa0] disabled:opacity-50 disabled:cursor-not-allowed ${
            suffix ? 'pr-12' : ''
          }`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600">
            {suffix}
          </span>
        )}
      </div>
    </FormFieldShell>
  );
};

export default NumberInputField;
