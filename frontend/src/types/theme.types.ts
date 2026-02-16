export type Theme = "light" | "dark";

export interface ThemeConfig {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
