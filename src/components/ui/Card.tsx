import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export const Card = ({ children, title, className = "" }: CardProps) => {
  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  );
};
