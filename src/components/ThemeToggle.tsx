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
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {theme === 'dark' ? (
        <Sun className="w-6 h-6" />
      ) : (
        <Moon className="w-6 h-6" />
      )}
    </MotionButton>
  );
}