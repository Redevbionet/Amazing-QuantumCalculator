import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-white shadow-xl rounded-xl p-6 border border-gray-100 ${className}`}>
      {title && <h3 className="text-2xl font-bold mb-4 text-gray-800">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;