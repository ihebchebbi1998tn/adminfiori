import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  options: Option[];
  required?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  options,
  required
}) => {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <select
        name={name}
        required={required}
        className="w-full p-2 rounded border border-[#5a0c1a]/20 bg-white/50"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};