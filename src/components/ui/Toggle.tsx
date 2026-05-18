import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeColorClass?: string;
  label?: string;
}

const Toggle: React.FC<ToggleProps> = ({ 
  checked, 
  onChange, 
  activeColorClass = 'bg-sage-600', 
  label 
}) => {
  return (
    <label className="inline-flex items-center cursor-pointer no-print select-none">
      <div className="relative">
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`w-10 h-6 rounded-full transition-colors duration-200 ease-in-out bg-slate-200 ${checked ? activeColorClass : 'bg-slate-200'}`} />
        <div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
      {label && <span className="ml-2 text-sm font-medium text-slate-600">{label}</span>}
    </label>
  );
};

export default Toggle