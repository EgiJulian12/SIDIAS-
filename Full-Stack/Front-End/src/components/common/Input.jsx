// src/components/common/Input.jsx
const Input = ({
    label,
    name,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    error = '',
    disabled = false,
  }) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            rounded-lg border px-4 py-2 text-sm outline-none transition-all
            focus:ring-2 focus:ring-green-400
            ${error ? 'border-red-400' : 'border-gray-300'}
            ${disabled ? 'cursor-not-allowed bg-gray-100' : 'bg-white'}
          `}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  };
  
  export default Input;