import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const MotionButton = motion.button as any;

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <MotionButton
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-300 transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </MotionButton>
  );
}