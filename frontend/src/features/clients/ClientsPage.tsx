import { useState, useEffect } from "react";
import { Search, UserPlus, Mail, Phone, Building, X, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { NewClientModal } from "@/components/modals";
import { ClientModal } from "@/components/modals/ClientModal";
import { useAuth } from "@/hooks/useAuth";
import { useClients } from "@/hooks/useClients";
import { toast } from "sonner";
import { TableSkeleton } from "@/components/ui/Skeletons";
import { useDeals } from "@/hooks/useDeals";

// Componentes base
const Card = ({ className = "", children }: any) => (
  <div className={`bg-[var(--card)] border border-[var(--border)] rounded-lg ${className}`}>
    {children}
  </div>
);

const Button = ({ className = "", children, variant = "default", ...props }: { className?: string; children: any; variant?: 'default' | 'primary' | 'ghost'; [key: string]: any }) => {
  const variants = {
    default: "px-4 py-2 rounded-md font-medium transition-all bg-[var(--muted)] hover:bg-[var(--muted)]/80",
    primary: "btn-kion",
    ghost: "px-4 py-2 rounded-md hover:bg-[var(--muted)] transition-all"
  };
  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }: any) => (
  <input
    className={`px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${className}`}
    {...props}
  />
);

// Badge con dual theme (light/dark)
const Badge = ({ children, variant = "default", isDark }: any) => {
  const getVariantClasses = () => {
    if (variant === "success") {
      return isDark 
        ? "bg-green-900/30 text-green-400 border-green-800" 
        : "bg-green-600 text-white border-green-600";
    }
    if (variant === "warning") {
      return isDark 
        ? "bg-yellow-900/30 text-yellow-400 border-yellow-800" 
        : "bg-yellow-600 text-white border-yellow-600";
    }
    return "bg-[var(--muted)] text-[var(--muted-foreground)] border-[var(--border)]";
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getVariantClasses()}`}>
      {children}
    </span>
  );
};

// Data fake inicial - AHORA VIENE DEL STORAGE
// (Ver src/lib/storage.ts para los datos iniciales)

export default function ClientsPage() {
  const [q, setQ] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;


const { deals } = useDeals();


  // 🔑 Obtener usuario y rol
  const { user } = useAuth();
  const isDemo = user?.role === "demo";

  // 📦 Hook de localStorage para clientes
  const { clients, addClient, updateClient, deleteClient } = useClients();

  // 🌓 Detectar tema dark/light
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filtrado
  const filteredData = clients.filter(c => 
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.email.toLowerCase().includes(q.toLowerCase()) ||
    c.company.toLowerCase().includes(q.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleClientCreated = (newClient: any) => {
    addClient(newClient);
    toast.success("Cliente creado", {
      description: `${newClient.name} agregado correctamente`
    });
  };

  // Handler para actualizar cliente
  const handleClientUpdate = (clientId: string, updates: any) => {
    updateClient(clientId, updates);
    setSelectedClient(null);
    setIsEditModalOpen(false);
  };

  // Handler para eliminar cliente
  const handleClientDelete = (clientId: string) => {
    deleteClient(clientId);
    setSelectedClient(null);
    setIsEditModalOpen(false);
  };

  // Handler para botón "Nuevo Cliente" con validación de demo
  const handleNewClientClick = () => {
    if (isDemo) {
      toast.info("Demo Mode", {
        description: "La creación de clientes está deshabilitada en modo demo"
      });
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 bg-[var(--background)]">
      
      {/* Header limpio */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Clientes</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Gestiona tu cartera de {clients.length} clientes
          </p>
        </div>
        
        {/* Botón con estado demo */}
        <Button 
          variant="primary" 
          className={`flex items-center gap-2 ${isDemo ? 'opacity-60 cursor-not-allowed' : ''}`}
          onClick={handleNewClientClick}
        >
          {isDemo ? <Lock className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          Nuevo Cliente
        </Button>
      </div>

      {/* Card principal */}
      <Card className="p-6">
        
        {/* Búsqueda y filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Buscar por nombre, email o empresa..."
              value={q}
              onChange={(e: any) => {
                setQ(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 w-full"
            />
          </div>
          <Button variant="default" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
          </Button>
        </div>

        {/* Divider */}
        <div className="kion-divider mb-6" />

        {/* Banner informativo para demo mode - DUAL THEME */}
        {isDemo && (
          isDark ? (
            // ====== DARK MODE BANNER ======
            <div className="mb-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-100">
                  Modo Demo Activo
                </p>
                <p className="text-xs text-blue-300 mt-1">
                  Estás navegando en modo solo lectura. Las funciones de creación y edición están deshabilitadas.
                </p>
              </div>
            </div>
          ) : (
            // ====== LIGHT MODE BANNER ======
            <div className="mb-6 p-4 rounded-lg flex items-start gap-3" style={{
              backgroundColor: '#e0f2fe',
              border: '2px solid #06b6d4'
            }}>
              <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0891b2' }} />
              <div>
                <p className="text-sm font-bold" style={{ color: '#000000' }}>
                  Modo Demo Activo
                </p>
                <p className="text-xs font-medium mt-1" style={{ color: '#1f2937' }}>
                  Estás navegando en modo solo lectura. Las funciones de creación y edición están deshabilitadas.
                </p>
              </div>
            </div>
          )
        )}

        {/* Tabla CON SKELETON */}
        {loading ? (
          <TableSkeleton rows={5} columns={6} />
        ) : (
          <div className="border border-[var(--border)] rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-[var(--muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-[var(--foreground)]">Cliente</th>
                  <th className="p-4 text-left text-sm font-semibold text-[var(--foreground)]">Empresa</th>
                  <th className="p-4 text-left text-sm font-semibold text-[var(--foreground)]">Estado</th>
                  <th className="p-4 text-left text-sm font-semibold text-[var(--foreground)]">Deals</th>
                  <th className="p-4 text-left text-sm font-semibold text-[var(--foreground)]">Valor</th>
                  <th className="p-4 text-left text-sm font-semibold text-[var(--foreground)]">Último contacto</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Search className="w-12 h-12 text-[var(--muted-foreground)] opacity-50" />
                        <p className="text-[var(--muted-foreground)]">
                          No se encontraron clientes
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((client) => (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className="border-t border-[var(--border)] kion-row-hover transition-all cursor-pointer group"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            {client.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors truncate">
                              {client.name}
                            </p>
                            <p className="text-sm text-[var(--muted-foreground)] truncate">{client.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-[var(--muted-foreground)]" />
                          <span className="text-sm text-[var(--foreground)]">{client.company}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={client.status === "active" ? "success" : client.status === "prospect" ? "warning" : "default"}
                          isDark={isDark}
                        >
                        {client.status === "active" ? "Activo" : client.status === "prospect" ? "Prospect" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[var(--foreground)]">
                      {deals.filter(d => d.client === client.name).length}
                      </span>
                          <span className="text-xs text-[var(--muted-foreground)]">deals</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-[var(--foreground)]">
                          ${client.value.toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-[var(--muted-foreground)]">
                          {client.lastContact}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {!loading && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-[var(--muted-foreground)]">
              Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} de {filteredData.length} clientes
            </p>
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </Button>
              <Button
                variant="default"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 disabled:opacity-50"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Sidebar de detalle */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
          <div className="w-full max-w-md h-full bg-[var(--card)] shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right">
            
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)]">{selectedClient.name}</h2>
                <p className="text-[var(--muted-foreground)] mt-1">{selectedClient.company}</p>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              
{/* Estado */}
              <div>
                <Badge 
                  variant={selectedClient.status === "active" ? "success" : selectedClient.status === "prospect" ? "warning" : "default"}
                  isDark={isDark}
                >
                  {selectedClient.status === "active" ? "Cliente Activo" : selectedClient.status === "prospect" ? "Prospect" : "Inactivo"}
                </Badge>
              </div>

              {/* Contacto */}
              <div className="space-y-3">
                <h3 className="font-semibold text-[var(--foreground)]">Información de contacto</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-[var(--muted-foreground)]" />
                    <span className="text-[var(--foreground)]">{selectedClient.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-[var(--muted-foreground)]" />
                    <span className="text-[var(--foreground)]">{selectedClient.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Building className="w-4 h-4 text-[var(--muted-foreground)]" />
                    <span className="text-[var(--foreground)]">{selectedClient.industry}</span>
                  </div>
                </div>
              </div>

              <div className="kion-divider" />

              {/* Métricas */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Deals activos</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">{selectedClient.deals}</p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm text-[var(--muted-foreground)] mb-1">Valor total</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    ${(selectedClient.value / 1000).toFixed(0)}K
                  </p>
                </Card>
              </div>

              {/* Último contacto */}
              <div>
                <h3 className="font-semibold text-[var(--foreground)] mb-2">Actividad reciente</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Último contacto: {selectedClient.lastContact}
                </p>
              </div>

              {/* Acciones con demo mode */}
              <div className="space-y-2 pt-4">
                <div className="relative group">
                  <Button 
                    variant="primary" 
                    className={`w-full ${isDemo ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={() => {
                      if (isDemo) {
                        toast.info("Demo Mode", {
                          description: "No puedes editar clientes en modo demo"
                        });
                        return;
                      }
                      setIsEditModalOpen(true);
                    }}
                  >
                    {isDemo && <Lock className="w-4 h-4 mr-2" />}
                    Editar Cliente
                  </Button>
                  {isDemo && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      🔒 Deshabilitado en modo demo
                    </div>
                  )}
                </div>
                <Button variant="default" className="w-full">
                  Ver Deals
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Modal de edición de cliente */}
      {selectedClient && (
        <ClientModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleClientUpdate}
          onDelete={handleClientDelete}
          editClient={clients.find(c => c.id === selectedClient.id)}
        />
      )}

      {/* Modal Nuevo Cliente */}
      <NewClientModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClientCreated={handleClientCreated}
      />

    </div>
  );
}
