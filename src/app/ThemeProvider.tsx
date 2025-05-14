"use client";

import { createContext, useContext } from "react";

// With our new design approach, we're always using dark mode, 
// but we'll keep the ThemeContext to prevent breaking existing components

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

// Provide a default value to the context so we don't need to check for undefined
const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => console.log("Theme toggle is disabled - using dark mode only")
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Our new design is always dark mode
  return (
    <ThemeContext.Provider 
      value={{ 
        theme: "dark", 
        toggleTheme: () => console.log("Theme toggle is disabled - using dark mode only")
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 