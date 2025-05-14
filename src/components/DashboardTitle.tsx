import React, { ReactNode } from 'react';

interface DashboardTitleProps {
  title: string;
  subtitle?: string;
  highlightPart?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

/**
 * A styled title component for dashboard pages
 */
export default function DashboardTitle({
  title,
  subtitle,
  highlightPart,
  icon,
  actions,
}: DashboardTitleProps) {
  // If highlightPart is provided, wrap it in gradient styling
  const formattedTitle = highlightPart
    ? title.replace(
        highlightPart,
        `<span class="gradient-text">${highlightPart}</span>`
      )
    : title;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div className="flex items-center">
        {icon && (
          <div className="mr-3 text-3xl bg-dark-800 w-12 h-12 rounded-xl shadow-neuro flex items-center justify-center animate-float">
            {icon}
          </div>
        )}
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-white"
            dangerouslySetInnerHTML={{ __html: formattedTitle }}
          />
          {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="ml-auto">{actions}</div>}
    </div>
  );
} 