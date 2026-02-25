import React, { useEffect, useState } from 'react';
import FormFieldShell from './FormFieldShell';

type RangeSliderFieldProps = {
  id: string;
  name: string;
  label: string;
  value: number;
  min: number;
  max: number;
  error?: string;
  unit?: string;
  onCommitValue: (value: number) => void;
};

const RangeSliderField: React.FC<RangeSliderFieldProps> = ({
  id,
  name,
  label,
  value,
  min,
  max,
  error,
  unit = '',
  onCommitValue,
}) => {
  const [draftValue, setDraftValue] = useState(value);

  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  return (
    <FormFieldShell
      label={`${label}: ${draftValue}${unit ? ` ${unit}` : ''}`}
      htmlFor={id}
      error={error}
    >
      <input
        id={id}
        name={name}
        type="range"
        min={min}
        max={max}
        value={draftValue}
        onChange={(e) => setDraftValue(parseInt(e.currentTarget.value, 10))}
        onPointerUp={() => onCommitValue(draftValue)}
        style={{
          background: '#ffffff',
        }}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#27baa0] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#27baa0] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min} months</span>
        <span>{max} months</span>
      </div>
    </FormFieldShell>
  );
};

export default RangeSliderField;
