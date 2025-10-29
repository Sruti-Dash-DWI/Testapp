import React, { createContext, useContext, useState, useEffect } from "react";

// Create Context
const ThemeContext = createContext();

// Custom hook for easy access
export const useTheme = () => useContext(ThemeContext);

// Provider Component
export const ThemeProvider = ({ children }) => {
  // Check saved theme in localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light";
  });

  // Toggle theme and save preference
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Apply theme class to <html> or <body>
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // You can store other global variables here too
  const values = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
    colors: {
      background: theme === "dark" ? "#0f172a" : "#ffffff",
      text: theme === "dark" ? "#f8fafc" : "#1e293b",
      card: theme === "dark" ? "#1e293b" : "#f1f5f9",
      border: theme === "dark" ? "#334155" : "#e2e8f0",
      
    },
  };

  return <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>;
};
