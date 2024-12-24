import React from 'react';
import { X } from 'lucide-react';

interface FormHeaderProps {
  title: string;
  onClose: () => void;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-semibold text-[#5a0c1a]">{title}</h3>
      <button 
        onClick={onClose} 
        className="p-2 hover:bg-[#5a0c1a]/10 rounded-lg"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};