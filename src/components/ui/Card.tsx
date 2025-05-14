import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'magenta' | 'blue' | 'none';
  hoverEffect?: boolean;
  onClick?: () => void;
}

export default function Card({ 
  children, 
  className = '', 
  glowColor = 'cyan',
  hoverEffect = true,
  onClick 
}: CardProps) {
  const getGlowClass = () => {
    if (!hoverEffect) return '';
    
    switch(glowColor) {
      case 'cyan': return 'hover:shadow-glow';
      case 'magenta': return 'hover:shadow-glow-magenta';
      case 'blue': return 'hover:shadow-glow-blue';
      case 'none': return '';
      default: return 'hover:shadow-glow';
    }
  };

  return (
    <div 
      className={`
        neuro-card p-6 
        ${hoverEffect ? 'transform hover:scale-[1.02] cursor-pointer' : ''} 
        ${getGlowClass()} 
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
} 