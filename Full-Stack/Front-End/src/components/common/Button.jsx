// src/components/common/Button.jsx
const Button = ({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  fullWidth = false,
}) => {
  const base =
    'rounded-lg font-semibold transition-all focus:outline-none focus:ring-2';

  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-400',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400',
    outline:
      'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${base}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
      `}
    >
      {label}
    </button>
  );
};

export default Button;