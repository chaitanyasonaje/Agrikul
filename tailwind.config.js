/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        dark: {
          700: '#232339',
          800: '#1a1a2e',
          900: '#121224',
        },
        cyan: {
          glow: '#00d4ff',
        },
        magenta: {
          glow: '#ff00ff',
        },
        blue: {
          glow: '#0066ff',
        },
        status: {
          success: '#22c55e',
          warning: '#eab308',
          danger: '#ef4444',
          info: '#0284c7',
          spo2: '#00e676',
          heart: '#f759ab',
        }
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232d2d3a' fill-opacity='0.15' fill-rule='evenodd'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z'/%3E%3C/g%3E%3C/svg%3E\")",
        'gradient-text': 'linear-gradient(90deg, #00d4ff, #ff00ff, #0066ff)',
      },
      boxShadow: {
        'neuro': '8px 8px 16px #121218, -8px -8px 16px #252538',
        'neuro-sm': '4px 4px 8px #121218, -4px -4px 8px #252538',
        'neuro-inset': 'inset 3px 3px 6px #121218, inset -3px -3px 6px #252538',
        'neuro-inset-sm': 'inset 2px 2px 4px #121218, inset -2px -2px 4px #252538',
        'glow': '0 0 15px rgba(0, 212, 255, 0.5)',
        'glow-magenta': '0 0 15px rgba(255, 0, 255, 0.5)',
        'glow-blue': '0 0 15px rgba(0, 102, 255, 0.5)',
        'glow-cyan': '0 0 15px rgba(0, 212, 255, 0.5)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0, 212, 255, 0.5)' },
          '33%': { boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)' },
          '66%': { boxShadow: '0 0 15px rgba(0, 102, 255, 0.5)' },
        },
        gradientMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'glow-pulse': 'glow 4s ease-in-out infinite',
        'gradient-shift': 'gradientMove 3s ease infinite',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'scaleIn': 'scaleIn 0.5s ease-out forwards',
        'bounceIn': 'bounceIn 0.5s ease-out forwards',
        'pulse': 'pulse 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}; 