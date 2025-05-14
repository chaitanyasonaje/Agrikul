import { ReactNode } from 'react';
import Link from 'next/link';

interface ButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  icon?: ReactNode;
  isLoading?: boolean;
}

export default function Button({
  children,
  className = '',
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon,
  isLoading = false,
}: ButtonProps) {
  
  const baseClasses = 'rounded-lg font-medium flex items-center justify-center transition-all duration-300 btn-hover-effect';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5',
    lg: 'px-7 py-3 text-lg',
  };
  
  const variantClasses = {
    primary: 'neuro-button text-white',
    secondary: 'bg-dark-800/70 text-white shadow-neuro hover:shadow-glow',
    outline: 'bg-transparent border border-cyan-glow text-white hover:bg-cyan-glow/10',
    gradient: 'bg-gradient-text text-white hover:opacity-90 shadow-glow',
  };
  
  const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed' : '';
  const widthClass = fullWidth ? 'w-full' : '';
  const loadingClass = isLoading ? 'opacity-80' : '';
  
  const allClasses = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    ${disabledClasses} 
    ${widthClass} 
    ${loadingClass} 
    ${className}
  `;
  
  const content = (
    <>
      {isLoading && (
        <div className="mr-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {icon && !isLoading && <span className="mr-2">{icon}</span>}
      {children}
    </>
  );
  
  if (href) {
    return (
      <Link href={href} className={allClasses}>
        {content}
      </Link>
    );
  }
  
  return (
    <button
      type={type}
      className={allClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {content}
    </button>
  );
} 