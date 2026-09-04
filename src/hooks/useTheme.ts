import { useState } from "react";

const THEME_STORAGE_KEY = "nexora-theme";

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem(THEME_STORAGE_KEY) === "dark",
  );

  function toggleTheme() {
    setIsDarkMode((darkMode) => {
      const nextDarkMode = !darkMode;
      localStorage.setItem(THEME_STORAGE_KEY, nextDarkMode ? "dark" : "light");
      return nextDarkMode;
    });
  }

  return { isDarkMode, toggleTheme };
}
