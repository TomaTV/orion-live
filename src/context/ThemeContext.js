import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const fetchUserTheme = async () => {
      try {
        const response = await fetch("/api/users/info");
        const data = await response.json();
        if (response.ok) {
          const userTheme =
            data.theme || localStorage.getItem("theme") || "dark";
          setTheme(userTheme);
          document.documentElement.classList.toggle(
            "dark",
            userTheme === "dark"
          );
          localStorage.setItem("theme", userTheme);
        }
      } catch (error) {
        const fallbackTheme = localStorage.getItem("theme") || "dark";
        setTheme(fallbackTheme);
        document.documentElement.classList.toggle(
          "dark",
          fallbackTheme === "dark"
        );
      }
    };

    const path = window.location.pathname;
    if (path.startsWith("/app")) {
      fetchUserTheme();
    } else {
      const localTheme = localStorage.getItem("theme") || "dark";
      setTheme(localTheme);
      document.documentElement.classList.toggle("dark", localTheme === "dark");
    }
  }, []);

  const value = {
    theme,
    setTheme: (newTheme) => {
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    },
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
