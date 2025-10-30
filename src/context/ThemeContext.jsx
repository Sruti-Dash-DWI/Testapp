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
      background: theme === "dark" ? "#0f172a" : "#f8fafc", 
      text: theme === "dark" ? "#f8fafc" : "#1e293b",
      card: theme === "dark" ? "#1e293b" : "#ffffff", 
      border: theme === "dark" ? "#334155" : "#e2e8f0", 
      textSubtle: theme === "dark" ? "#94a3b8" : "#64748b", 
      backgroundHover: theme === "dark" ? "#334155" : "#f1f5f9",
      button:theme==="dark"?"#dadada":"#3b82f6",
      //hover: theme === "dark" ? "#abcbf7ff" : "#f1f5f9",
    },
  };

  return (
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  );
};
