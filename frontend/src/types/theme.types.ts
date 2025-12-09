export type Theme = "light" | "dark";

export interface ThemeConfig {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
}