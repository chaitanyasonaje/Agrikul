interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'gradient';
}

export default function LoadingSpinner({
  size = 'md',
  className = '',
  variant = 'default'
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const variantClasses = {
    default: 'border-white/20 border-t-white',
    gradient: 'border-transparent border-t-gradient-text'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${variant === 'gradient' ? 'bg-gradient-text bg-[length:200%_auto] animate-gradient-shift rounded-full' : ''}
        rounded-full animate-spin 
        ${variant === 'default' ? variantClasses.default : ''}
        ${className}
      `}
    />
  );
} 