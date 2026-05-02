// src/components/common/Badge.jsx
const Badge = ({ label, variant = 'normal' }) => {
    const variants = {
      normal: 'bg-green-100 text-green-700',
      stunting: 'bg-yellow-100 text-yellow-700',
      severe: 'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700',
    };
  
    return (
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]}`}
      >
        {label}
      </span>
    );
  };
  
  export default Badge;