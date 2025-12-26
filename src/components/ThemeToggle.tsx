import React from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../ThemeContext";

const MotionButton = motion.button;

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <MotionButton
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`
        relative flex items-center justify-center
        w-9 h-9 rounded-md
        border transition-colors duration-300
        ${
          isDark
            ? "bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-neutral-100"
            : "bg-white border-neutral-200 text-neutral-700 hover:text-neutral-900"
        }
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Icon crossfade */}
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {isDark ? (
          <Sun className="w-4 h-4" />
        ) : (
          <Moon className="w-4 h-4" />
        )}
      </motion.div>
    </MotionButton>
  );
}
