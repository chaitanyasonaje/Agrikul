'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle('mobile-menu-open');
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    if (isOpen) {
      setIsOpen(false);
      document.body.classList.remove('mobile-menu-open');
    }
  };

  const navItems = [
    { name: 'Home', path: '/auth/register' },
    { name: 'Marketplace', path: '/auth/register' },
    { name: 'About', path: '/auth/register' },
    { name: 'Contact', path: '/auth/register' },
  ];

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-dark-900/95 backdrop-blur-md py-3' : 'bg-dark-900 py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/auth/register" className="relative z-10">
          <h1 className="text-2xl font-bold text-white hover:scale-105 transition-transform duration-300">
            <span className="gradient-text">Agrikul</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              onClick={handleLinkClick}
              className={`text-white hover:text-cyan-glow transition-colors relative ${
                pathname === item.path ? 'text-shadow-glow' : ''
              }`}
            >
              {item.name}
              {pathname === item.path && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-text animate-gradient-shift"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <Link 
              href="/dashboard" 
              className="neuro-button px-5 py-2 text-white btn-hover-effect"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/auth/register" 
                className="text-white hover:text-cyan-glow transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/auth/register" 
                className="neuro-button px-5 py-2 text-white btn-hover-effect"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden relative z-10 focus:outline-none"
          onClick={toggleMenu} 
          aria-label="Toggle Menu"
        >
          <div className="w-6 flex flex-col justify-between h-5">
            <span 
              className={`h-0.5 w-full bg-white rounded-full transition-transform duration-300 ${
                isOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span 
              className={`h-0.5 bg-white rounded-full transition-opacity duration-300 ${
                isOpen ? 'opacity-0 w-0' : 'w-full'
              }`}
            ></span>
            <span 
              className={`h-0.5 w-full bg-white rounded-full transition-transform duration-300 ${
                isOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </div>
        </button>

        {/* Mobile Menu */}
        <div 
          className={`fixed inset-0 bg-dark-900/98 backdrop-blur-lg flex flex-col justify-center items-center transition-all duration-500 md:hidden ${
            isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <nav className="flex flex-col items-center space-y-8 mb-12">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={handleLinkClick}
                className={`text-xl font-medium text-white hover:text-cyan-glow transition-colors ${
                  pathname === item.path ? 'text-shadow-glow gradient-text' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex flex-col space-y-4 w-64">
            {isLoggedIn ? (
              <Link 
                href="/dashboard" 
                onClick={handleLinkClick}
                className="neuro-button px-5 py-3 text-center text-white btn-hover-effect"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/auth/register" 
                  onClick={handleLinkClick}
                  className="neuro-button px-5 py-3 text-center text-white btn-hover-effect"
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  onClick={handleLinkClick}
                  className="neuro-button px-5 py-3 text-center text-white btn-hover-effect"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 