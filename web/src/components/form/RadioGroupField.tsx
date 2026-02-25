import React from 'react';
import FormFieldShell from './FormFieldShell';

type RadioOption = {
  value: string;
  label: string;
};

type RadioGroupFieldProps = {
  name: string;
  label: string;
  value: string;
  options: RadioOption[];
  error?: string;
  onChangeValue: (value: string) => void;
};

const RadioGroupField: React.FC<RadioGroupFieldProps> = ({
  name,
  label,
  value,
  options,
  error,
  onChangeValue,
}) => {
  return (
    <FormFieldShell label={label} htmlFor={`${name}-${options[0]?.value ?? ''}`} error={error}>
      <div className="flex gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              id={`${name}-${option.value}`}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChangeValue(option.value)}
              style={{ border: 'none', outline: 'none' }}
              className="w-4 h-4 text-[#27baa0] accent-[#27baa0]"
            />
            <span className="text-sm text-foreground">{option.label}</span>
          </label>
        ))}
      </div>
    </FormFieldShell>
  );
};

export default RadioGroupField;
