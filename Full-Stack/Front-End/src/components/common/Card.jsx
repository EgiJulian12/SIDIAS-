// src/components/common/Card.jsx
const Card = ({ children, className = '' }) => {
    return (
      <div
        className={`rounded-xl bg-white p-6 shadow-sm border border-gray-100 ${className}`}
      >
        {children}
      </div>
    );
  };
  
  export default Card;