import { forwardRef } from 'react';

const Select = forwardRef(function Select({ label, error, children, className = '', id, name, ...props }, ref) {
  const selectId = id || name;

  return (
    <div className={className}>
      {label && (
        <label className="label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        name={name}
        className={`input ${error ? 'border-red-500' : ''}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default Select;
