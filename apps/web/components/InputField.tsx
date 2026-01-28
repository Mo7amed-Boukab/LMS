import React, { forwardRef, useState } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon: string;
  error?: string;
  showPasswordToggle?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, icon, error, showPasswordToggle, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = showPasswordToggle && showPassword ? "text" : type;

    return (
      <div>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm text-gray-700 mb-2"
          >
            {label}
          </label>
        )}

        <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-red-300">
          <span className="material-symbols-outlined text-red-500 mr-3 text-[20px]">
            {icon}
          </span>

          <input
            ref={ref}
            type={inputType}
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
            {...props}
          />

          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="ml-2 p-1 rounded-md"
            >
              <span className="material-symbols-outlined text-gray-400 text-[20px]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          )}
        </div>

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
