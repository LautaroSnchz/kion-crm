import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FolderKanban, LogOut } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <aside className="hidden md:flex md:w-60 flex-col border-r bg-card p-4">
      <div className="text-xl font-bold mb-4 text-foreground">KionCRM</div>
      
      {/* Badge de rol */}
      {user && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-[var(--muted)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Sesión activa</p>
              <p className="text-sm font-medium text-[var(--foreground)]">{user.name}</p>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.role === "admin"
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
              }`}
            >
              {user.role === "admin" ? "Admin" : "Demo"}
            </div>
          </div>
        </div>
      )}
      
      <nav className="space-y-1 flex-1">
        <NavLink 
          to="/" 
          end 
          className={({isActive}) => `
            flex items-center gap-2 px-3 py-2 rounded-lg 
            text-foreground hover:bg-primary/10 transition-colors
            ${isActive ? 'bg-primary/20 font-medium' : ''}
          `}
        >
          <LayoutDashboard className="size-4" /> Dashboard
        </NavLink>
        
        <NavLink 
          to="/clients" 
          className={({isActive}) => `
            flex items-center gap-2 px-3 py-2 rounded-lg 
            text-foreground hover:bg-primary/10 transition-colors
            ${isActive ? 'bg-primary/20 font-medium' : ''}
          `}
        >
          <Users className="size-4" /> Clientes
        </NavLink>
        
        <NavLink 
          to="/projects" 
          className={({isActive}) => `
            flex items-center gap-2 px-3 py-2 rounded-lg 
            text-foreground hover:bg-primary/10 transition-colors
            ${isActive ? 'bg-primary/20 font-medium' : ''}
          `}
        >
          <FolderKanban className="size-4" /> Proyectos
        </NavLink>
      </nav>
      
      {/* Footer con tema y logout */}
      <div className="mt-auto pt-4 border-t space-y-3">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm text-muted-foreground">Tema</span>
          <ThemeToggle />
        </div>

        {/* Botón de logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--muted-foreground)] hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </button>

        <div className="text-xs text-muted-foreground text-center">
          v0.1 • {new Date().getFullYear()}
        </div>
      </div>
    </aside>
  );
}