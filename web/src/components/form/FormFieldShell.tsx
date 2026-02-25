import React from 'react';

type FormFieldShellProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
};

const FormFieldShell: React.FC<FormFieldShellProps> = ({
  label,
  htmlFor,
  error,
  children,
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-sm" style={{ color: '#ff6b6f' }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormFieldShell;
