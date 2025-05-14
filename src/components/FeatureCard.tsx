'use client';

import { ReactNode } from 'react';
import Card from './ui/Card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  glowColor?: 'cyan' | 'magenta' | 'blue';
  onClick?: () => void;
}

export default function FeatureCard({
  title,
  description,
  icon,
  glowColor = 'cyan',
  onClick,
}: FeatureCardProps) {
  return (
    <Card 
      className="h-full transition-all duration-500 group"
      glowColor={glowColor}
      onClick={onClick}
    >
      <div className="relative">
        {/* Icon container with glow effect */}
        <div className={`
          w-14 h-14 rounded-xl bg-dark-800 flex items-center justify-center mb-6
          shadow-neuro group-hover:shadow-${glowColor === 'cyan' ? 'glow' : glowColor === 'magenta' ? 'glow-magenta' : 'glow-blue'}
          transition-all duration-500 transform group-hover:scale-110
        `}>
          <span className="text-3xl">{icon}</span>
        </div>
        
        {/* Title with gradient effect on hover */}
        <h3 className="text-xl font-bold mb-3 text-white group-hover:gradient-text transition-all duration-300">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
        
        {/* Bottom indicator line with gradient */}
        <div className="w-0 h-0.5 bg-gradient-text absolute -bottom-6 left-0 transition-all duration-500 opacity-0 group-hover:w-full group-hover:opacity-100"></div>
      </div>
    </Card>
  );
} 