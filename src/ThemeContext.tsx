// ThemeContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// Create the Theme Context
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState('dark'); // Set 'dark' as the default theme

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to 'dark' if nothing is saved
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme; // Apply the theme class to the body
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
