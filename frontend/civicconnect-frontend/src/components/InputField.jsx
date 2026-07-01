import { useState } from "react";

const InputField = ({ label, type = "text", value, onChange, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative mb-6">
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-4 pt-6 pb-2 rounded-xl text-base
          bg-slate-50 dark:bg-darksurf
          border-2 transition-all duration-300
          text-slate-900 dark:text-white
          ${isFocused ? 'border-brand-500 shadow-glow-sm' : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'}
          focus:outline-none
        `}
        {...props}
      />
      <label
        className={`
          absolute left-4 transition-all duration-300 pointer-events-none font-medium
          ${isFocused || hasValue 
            ? 'top-2 text-xs text-brand-600 dark:text-brand-400' 
            : 'top-4 text-base text-slate-500 dark:text-slate-400'
          }
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default InputField;
