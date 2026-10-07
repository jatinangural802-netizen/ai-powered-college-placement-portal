import { forwardRef } from 'react';

const Input = forwardRef(function Input({ label, error, className = '', id, name, ...props }, ref) {
  const inputId = id || name;

  return (
    <div className={className}>
      {label && (
        <label className="label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        name={name}
        className={`input ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default Input;
