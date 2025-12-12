import { useState } from "react";
import { 
  LayoutGrid, 
  List, 
  Filter, 
  Plus,
  DollarSign,
  Calendar,
  User,
  X,
  TrendingUp
} from "lucide-react";

// Componentes base
const Card = ({ className = "", children }: any) => (
  <div className={`bg-[var(--card)] border border-[var(--border)] rounded-lg ${className}`}>
    {children}
  </div>
);

const Button = ({ className = "", children, variant = "default", ...props }: any) => {
  const variants = {
    default: "px-4 py-2 rounded-md font-medium transition-all bg-[var(--muted)] hover:bg-[var(--muted)]/80",
    primary: "btn-kion",
    ghost: "px-3 py-2 rounded-md hover:bg-[var(--muted)] transition-all text-sm"
  };
  return (
    <button className={`${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children, variant = "default" }: any) => {
  const variants = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant] || variants.high}`}>
      {children}
    </span>
  );
};

// Types
type Priority = "high" | "medium" | "low";
type Stage = "lead" | "qualified" | "proposal" | "closed";

interface Deal {
  id: string;
  title: string;
  client: string;
  value: number;
  closeDate: string;
  priority: Priority;
  owner: string;
  ownerAvatar: string;
  stage: Stage;
}

// Data fake
const FAKE_DEALS: Deal[] = [
  {
    id: "1",
    title: "Migración Cloud Platform",
    client: "Acme SA",
    value: 45000,
    closeDate: "2025-02-15",
    priority: "high",
    owner: "María G.",
    ownerAvatar: "MG",
    stage: "lead"
  },
  {
    id: "2",
    title: "Sistema CRM Enterprise",
    client: "Globex Corp",
    value: 89000,
    closeDate: "2025-01-30",
    priority: "high",
    owner: "Juan P.",
    ownerAvatar: "JP",
    stage: "qualified"
  },
  {
    id: "3",
    title: "Consultoría DevOps",
    client: "Initech",
    value: 12000,
    closeDate: "2025-03-10",
    priority: "low",
    owner: "Ana S.",
    ownerAvatar: "AS",
    stage: "lead"
  },
  {
    id: "4",
    title: "Desarrollo Web App",
    client: "Umbrella Co",
    value: 67000,
    closeDate: "2025-02-28",
    priority: "medium",
    owner: "María G.",
    ownerAvatar: "MG",
    stage: "proposal"
  },
  {
    id: "5",
    title: "Integración API B2B",
    client: "Stark Industries",
    value: 125000,
    closeDate: "2025-01-20",
    priority: "high",
    owner: "Juan P.",
    ownerAvatar: "JP",
    stage: "closed"
  },
  {
    id: "6",
    title: "Auditoría de Seguridad",
    client: "Wayne Enterprises",
    value: 34000,
    closeDate: "2025-02-05",
    priority: "medium",
    owner: "Ana S.",
    ownerAvatar: "AS",
    stage: "qualified"
  },
];

const STAGES = [
  { id: "lead", name: "Lead", color: "bg-blue-500" },
  { id: "qualified", name: "Qualified", color: "bg-purple-500" },
  { id: "proposal", name: "Proposal", color: "bg-orange-500" },
  { id: "closed", name: "Closed Won", color: "bg-green-500" },
];

const PRIORITY_LABELS = {
  high: { label: "Alta", dot: "bg-red-500" },
  medium: { label: "Media", dot: "bg-yellow-500" },
  low: { label: "Baja", dot: "bg-green-500" },
};

export default function ProjectsPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [deals] = useState<Deal[]>(FAKE_DEALS);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Agrupar deals por stage
  const dealsByStage = STAGES.map(stage => ({
    ...stage,
    deals: deals.filter(d => d.stage === stage.id),
    totalValue: deals
      .filter(d => d.stage === stage.id)
      .reduce((sum, d) => sum + d.value, 0)
  }));

  const DealCard = ({ deal }: { deal: Deal }) => {
    const priority = PRIORITY_LABELS[deal.priority];
    
    return (
      <Card 
        className="p-3 cursor-pointer hover:shadow-md transition-all group"
        onClick={() => setSelectedDeal(deal)}
      >
        {/* Header: Prioridad + Avatar */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${priority.dot}`} />
            <span className="text-xs text-[var(--muted-foreground)]">{priority.label}</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
            {deal.ownerAvatar}
          </div>
        </div>

        {/* Cliente */}
        <p className="text-xs text-[var(--muted-foreground)] mb-1">{deal.client}</p>
        
        {/* Título del deal */}
        <h4 className="font-semibold text-sm text-[var(--foreground)] mb-3 group-hover:text-[var(--primary)] transition-colors line-clamp-2">
          {deal.title}
        </h4>

        {/* Footer: Valor + Fecha */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-[var(--foreground)] font-semibold">
            <DollarSign className="w-3 h-3" />
            {(deal.value / 1000).toFixed(0)}K
          </div>
          <div className="flex items-center gap-1 text-[var(--muted-foreground)]">
            <Calendar className="w-3 h-3" />
            {new Date(deal.closeDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-[var(--background)] min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Pipeline de Ventas</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            {deals.length} deals activos · ${(deals.reduce((sum, d) => sum + d.value, 0) / 1000).toFixed(0)}K total
          </p>
        </div>
        
        <div className="flex gap-2">
          {/* Toggle de vista */}
          <div className="flex border border-[var(--border)] rounded-lg p-1">
            <Button
              variant="ghost"
              onClick={() => setView("kanban")}
              className={view === "kanban" ? "bg-[var(--muted)]" : ""}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => setView("list")}
              className={view === "list" ? "bg-[var(--muted)]" : ""}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          
          <Button variant="default" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Deal
          </Button>
        </div>
      </div>

      {/* Vista Kanban */}
      {view === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dealsByStage.map((stage) => (
            <div key={stage.id} className="flex flex-col">
              
              {/* Header de columna */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <h3 className="font-semibold text-[var(--foreground)]">{stage.name}</h3>
                  <span className="text-sm text-[var(--muted-foreground)]">
                    ({stage.deals.length})
                  </span>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  ${(stage.totalValue / 1000).toFixed(0)}K
                </p>
              </div>

              {/* Cards de deals */}
              <div className="space-y-3 flex-1">
                {stage.deals.length === 0 ? (
                  <Card className="p-6 text-center border-dashed">
                    <p className="text-sm text-[var(--muted-foreground)]">
                      No hay deals en esta etapa
                    </p>
                  </Card>
                ) : (
                  stage.deals.map(deal => (
                    <DealCard key={deal.id} deal={deal} />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista Lista */}
      {view === "list" && (
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[var(--border)]">
                <tr>
                  <th className="pb-3 text-left text-sm font-semibold text-[var(--foreground)]">Deal</th>
                  <th className="pb-3 text-left text-sm font-semibold text-[var(--foreground)]">Cliente</th>
                  <th className="pb-3 text-left text-sm font-semibold text-[var(--foreground)]">Etapa</th>
                  <th className="pb-3 text-left text-sm font-semibold text-[var(--foreground)]">Prioridad</th>
                  <th className="pb-3 text-left text-sm font-semibold text-[var(--foreground)]">Valor</th>
                  <th className="pb-3 text-left text-sm font-semibold text-[var(--foreground)]">Cierre</th>
                  <th className="pb-3 text-left text-sm font-semibold text-[var(--foreground)]">Owner</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => {
                  const stage = STAGES.find(s => s.id === deal.stage);
                  return (
                    <tr
                      key={deal.id}
                      onClick={() => setSelectedDeal(deal)}
                      className="border-t border-[var(--border)] hover:bg-[var(--muted)]/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 font-medium text-[var(--foreground)]">{deal.title}</td>
                      <td className="py-3 text-[var(--muted-foreground)]">{deal.client}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${stage?.color} text-white`}>
                          {stage?.name}
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge variant={deal.priority}>{PRIORITY_LABELS[deal.priority].label}</Badge>
                      </td>
                      <td className="py-3 font-semibold text-[var(--foreground)]">
                        ${(deal.value / 1000).toFixed(0)}K
                      </td>
                      <td className="py-3 text-[var(--muted-foreground)] text-sm">
                        {new Date(deal.closeDate).toLocaleDateString('es-AR')}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                            {deal.ownerAvatar}
                          </div>
                          <span className="text-sm text-[var(--muted-foreground)]">{deal.owner}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal de detalle */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant={selectedDeal.priority}>
                    {PRIORITY_LABELS[selectedDeal.priority].label}
                  </Badge>
                  <span className="text-sm text-[var(--muted-foreground)]">
                    {STAGES.find(s => s.id === selectedDeal.stage)?.name}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[var(--foreground)]">{selectedDeal.title}</h2>
                <p className="text-[var(--muted-foreground)] mt-1">{selectedDeal.client}</p>
              </div>
              <button
                onClick={() => setSelectedDeal(null)}
                className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Valor del deal</span>
                </div>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  ${selectedDeal.value.toLocaleString()}
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)] mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Fecha de cierre</span>
                </div>
                <p className="text-2xl font-bold text-[var(--foreground)]">
                  {new Date(selectedDeal.closeDate).toLocaleDateString('es-AR')}
                </p>
              </Card>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-[var(--foreground)] mb-3">Responsable</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                  {selectedDeal.ownerAvatar}
                </div>
                <div>
                  <p className="font-medium text-[var(--foreground)]">{selectedDeal.owner}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">Sales Representative</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="primary" className="flex-1">
                Editar Deal
              </Button>
              <Button variant="default" className="flex-1">
                Ver Actividad
              </Button>
            </div>

          </Card>
        </div>
      )}

    </div>
  );
}