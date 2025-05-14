'use client';

import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  
  const footerLinks = {
    'Quick Links': [
      { label: 'Marketplace', href: '/auth/register' },
      { label: 'Find Farmers', href: '/auth/register' },
      { label: 'Find Buyers', href: '/auth/register' },
      { label: 'Blog', href: '/auth/register' },
    ],
    'Resources': [
      { label: 'Weather Updates', href: '/auth/register' },
      { label: 'Crop Advisor', href: '/auth/register' },
      { label: 'Market Prices', href: '/auth/register' },
      { label: 'Help Center', href: '/auth/register' },
    ],
    'Legal': [
      { label: 'Privacy Policy', href: '/auth/register' },
      { label: 'Terms of Service', href: '/auth/register' },
      { label: 'Cookie Policy', href: '/auth/register' },
      { label: 'Compliance', href: '/auth/register' },
    ],
  };
  
  const socialLinks = [
    { label: 'Twitter', href: '/auth/register', icon: '𝕏' },
    { label: 'Facebook', href: '/auth/register', icon: 'f' },
    { label: 'Instagram', href: '/auth/register', icon: '📷' },
    { label: 'LinkedIn', href: '/auth/register', icon: 'in' },
  ];

  return (
    <footer className="bg-dark-900 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Grid background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Gradient accent line */}
      <div className="h-1 w-full bg-gradient-text absolute top-0 left-0"></div>
      
      {/* Blurred gradient orb for footer */}
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-glow/5 filter blur-3xl"></div>
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-magenta-glow/5 filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Branding */}
          <div>
            <Link href="/auth/register" className="inline-block">
              <h2 className="text-2xl font-bold gradient-text mb-4">Agrikul</h2>
            </Link>
            <p className="text-gray-400 mb-6">Connecting farmers and buyers directly for a sustainable agricultural ecosystem.</p>
            
            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href} 
                  className="w-9 h-9 rounded-full neuro-button flex items-center justify-center text-sm hover:shadow-glow-blue transform hover:scale-110 transition-all duration-300"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-4 text-lg">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href} 
                      className="text-gray-400 hover:text-cyan-glow transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Contact</h3>
            <p className="text-gray-400 mb-2 hover:text-cyan-glow transition-colors duration-300">
              chaitanyasonaje0205@gmail.com
            </p>
            <p className="text-gray-400 hover:text-cyan-glow transition-colors duration-300">
              8010083340
            </p>
            
            {/* Newsletter signup */}
            <div className="mt-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                Join our newsletter
              </label>
              <div className="flex">
                <input
                  type="email"
                  id="email"
                  placeholder="Your email"
                  className="px-3 py-2 bg-dark-800/50 shadow-neuro-inset rounded-l-lg border-r border-dark-900 focus:outline-none focus:shadow-glow text-white"
                />
                <Link href="/auth/register">
                  <button className="bg-gradient-text px-4 py-2 rounded-r-lg">
                    Join
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; {year} Agrikul. All rights reserved. Made with love by chaitanyasonaje</p>
        </div>
      </div>
    </footer>
  );
} 