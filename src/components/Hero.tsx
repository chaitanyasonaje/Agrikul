'use client';

import { useEffect, useState } from 'react';
import Button from './ui/Button';

interface HeroProps {
  title: string;
  subtitle: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA?: {
    text: string;
    href: string;
  };
}

export default function Hero({ 
  title, 
  subtitle, 
  primaryCTA, 
  secondaryCTA 
}: HeroProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-900 bg-grid-pattern">
      {/* Gradient orbs */}
      <div className={`absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-cyan-glow/20 filter blur-3xl opacity-0 transition-opacity duration-1000 animate-float ${isVisible ? 'opacity-30' : ''}`}></div>
      
      <div className={`absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-magenta-glow/20 filter blur-3xl opacity-0 transition-opacity duration-1000 delay-300 animate-float ${isVisible ? 'opacity-30' : ''}`} style={{ animationDelay: '1s' }}></div>
      
      <div className={`absolute top-1/2 right-1/3 w-72 h-72 rounded-full bg-blue-glow/20 filter blur-3xl opacity-0 transition-opacity duration-1000 delay-500 animate-float ${isVisible ? 'opacity-30' : ''}`} style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className={`text-4xl md:text-6xl font-bold text-white mb-6 opacity-0 transform translate-y-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : ''
            }`}
          >
            <span className="gradient-text text-shadow-glow">{title}</span>
          </h1>
          
          <p 
            className={`text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto opacity-0 transform translate-y-8 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : ''
            }`}
          >
            {subtitle}
          </p>
          
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 transform translate-y-8 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : ''
            }`}
          >
            <Button 
              href={primaryCTA.href} 
              variant="gradient" 
              size="lg"
            >
              {primaryCTA.text}
            </Button>
            
            {secondaryCTA && (
              <Button 
                href={secondaryCTA.href} 
                variant="outline" 
                size="lg"
              >
                {secondaryCTA.text}
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Background grid lines for depth */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
    </section>
  );
} 