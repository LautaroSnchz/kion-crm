import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, FolderKanban } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 flex-col border-r bg-card p-4">
      <div className="text-xl font-bold mb-4 text-foreground">KionCRM</div>
      
      <nav className="space-y-1">
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
      
      {/* 👇 AGREGADO: Switch de tema en la parte inferior */}
      <div className="mt-auto pt-4 border-t space-y-3">
        <div className="flex items-center justify-between px-3 py-2">
  <span className="text-sm text-muted-foreground">Tema</span>
  <ThemeToggle />
</div>
        <div className="text-xs text-muted-foreground">
          v0.1 • {new Date().getFullYear()}
        </div>
      </div>
    </aside>
  );
}