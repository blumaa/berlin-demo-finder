import { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${className}`}
    >
      <h3 className="text-sm font-medium text-gray-500 mb-3">{title}</h3>
      {children}
    </div>
  );
}
