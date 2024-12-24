import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  step?: string;
  accept?: string;
  rows?: number;
  maxLength?: number;  // Added maxLength prop
  placeholder?: string;  // Added placeholder for better UX
  pattern?: string;  // Added pattern for validation
  min?: string | number;  // Added min for number inputs
  max?: string | number;  // Added max for number inputs
  defaultValue?: string | number;  // Added defaultValue
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  required,
  step,
  accept,
  rows,
  maxLength,
  placeholder,
  pattern,
  min,
  max,
  defaultValue
}) => {
  const baseClassName = "w-full p-2 rounded border border-[#5a0c1a]/20 bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#5a0c1a]/20";

  // Helper function to get placeholder text
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return `Enter ${label.toLowerCase()}...`;
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          name={name}
          required={required}
          rows={rows}
          maxLength={maxLength}
          placeholder={getPlaceholder()}
          className={`${baseClassName} min-h-[80px]`}
          defaultValue={defaultValue}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          step={step}
          accept={accept}
          maxLength={maxLength}
          placeholder={getPlaceholder()}
          pattern={pattern}
          min={min}
          max={max}
          defaultValue={defaultValue}
          className={`${baseClassName} ${
            type === 'file' ? 'file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-[#5a0c1a]/10 file:text-[#5a0c1a]' : ''
          }`}
        />
      )}
      
      {maxLength && (
        <p className="mt-1 text-xs text-gray-500">
          Maximum {maxLength} characters
        </p>
      )}
    </div>
  );
};
