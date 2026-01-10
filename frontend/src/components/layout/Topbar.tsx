import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export function Topbar() {
  const { user } = useAuth();

  return (
    <header className="flex md:hidden items-center justify-between border-b px-4 h-14">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="font-bold mb-4">KionCRM</div>
          <nav className="grid gap-2">
            <NavLink to="/" className="px-2 py-2 rounded hover:bg-muted">
              Dashboard
            </NavLink>
            <NavLink to="/clients" className="px-2 py-2 rounded hover:bg-muted">
              Clientes
            </NavLink>
            <NavLink to="/projects" className="px-2 py-2 rounded hover:bg-muted">
              Proyectos
            </NavLink>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="font-semibold">KionCRM</div>

      {/* Badge de rol + Theme Toggle */}
      <div className="flex items-center gap-2">
        {user && (
<div
  className={`px-2 py-1 rounded-full text-xs font-medium ${
    user.role === "admin"
      ? "bg-cyan-500 text-white dark:bg-cyan-600 dark:text-white"
      : "bg-cyan-500 text-white dark:bg-cyan-600 dark:text-white"
  }`}
>
            {user.role === "admin" ? "Admin" : "Demo"}
          </div>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
