import React from "react";

interface CardProps {
  title: string;
  value: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, value, className }) => (
  <div className={`bg-white shadow rounded-lg p-4 ${className ?? ""}`}>
    <div className="text-sm text-gray-500">{title}</div>
    <div className="mt-2 text-2xl font-extrabold">{value}</div>
  </div>
);

export default Card;
