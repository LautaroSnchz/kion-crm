import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const checked = theme === "dark";

  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      
      {/* Icono de Sol */}
      <Sun
        className={`size-4 transition-colors duration-300 
          ${checked ? "text-muted-foreground" : "text-primary"}`}
        aria-hidden="true"
      />

      {/* Switch */}
      <Switch
        checked={checked}
        onCheckedChange={() => {
          // transición suave
          document.documentElement.classList.add("theme-smooth");
          toggle();
          setTimeout(() => {
            document.documentElement.classList.remove("theme-smooth");
          }, 320);
        }}
        aria-label="Cambiar tema"
        className={`
          data-[state=checked]:bg-[color-mix(in_oklab,var(--primary)_60%,black)]
          data-[state=unchecked]:bg-border
          ring-1 ring-[color:var(--ring)]
          transition-colors duration-300
        `}
      />

      {/* Icono de Luna */}
      <Moon
        className={`size-4 transition-colors duration-300 
          ${checked ? "text-primary" : "text-muted-foreground"}`}
        aria-hidden="true"
      />
    </label>
  );
}
