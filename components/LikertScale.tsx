
import React from 'react';

interface LikertScaleProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const LikertScale: React.FC<LikertScaleProps> = ({ value, onChange, disabled }) => {
  const options = [
    { val: 1, label: 'Discordo Totalmente' },
    { val: 2, label: 'Discordo' },
    { val: 3, label: 'Neutro' },
    { val: 4, label: 'Concordo' },
    { val: 5, label: 'Concordo Totalmente' },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full mt-4">
      {options.map((opt) => {
        const isActive = value === opt.val;
        return (
          <button
            key={opt.val}
            disabled={disabled}
            type="button"
            onClick={() => onChange(opt.val)}
            className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 text-sm font-medium flex flex-col items-center gap-2
              ${isActive ? 'ring-4 ring-orange-100 border-orange-600 bg-orange-50 scale-[1.02]' : 'border-slate-200 bg-white hover:border-slate-300'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${isActive ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {opt.val}
            </span>
            <span className={`text-center ${isActive ? 'text-orange-900' : 'text-slate-600'}`}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LikertScale;
