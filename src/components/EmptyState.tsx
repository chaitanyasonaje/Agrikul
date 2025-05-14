import { ReactNode } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon = '📦',
  actionLabel,
  actionHref,
  actionOnClick,
  className = '',
}: EmptyStateProps) {
  return (
    <Card className={`p-8 text-center ${className}`} hoverEffect={false}>
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-800 flex items-center justify-center text-4xl animate-float">
        {icon}
      </div>
      <h2 className="text-xl font-medium text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      
      {(actionLabel && (actionHref || actionOnClick)) && (
        <Button
          href={actionHref}
          onClick={actionOnClick}
          variant="gradient"
          className="mx-auto"
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
} 