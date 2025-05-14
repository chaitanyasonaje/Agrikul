"use client";

import { Moon } from "lucide-react";

export default function ThemeToggle() {
  // Since we're using forced dark mode, this is just a visual element for now
  return (
    <button 
      className="p-2 rounded-full neuro-button text-gray-300 hover:text-cyan-glow transition-colors duration-300" 
      aria-label="Toggle dark mode"
    >
      <Moon size={18} />
    </button>
  );
} 