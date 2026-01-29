import { useState, useEffect, useMemo, useRef } from "react";
import { 
  LayoutGrid, 
  List, 
  Filter, 
  Plus,
  DollarSign,
  Calendar,
  X,
  TrendingUp,
  GripVertical,
  Lock
} from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NewDealModal } from "@/components/modals";
import { useAuth } from "@/hooks/useAuth";
import { useDeals } from "@/hooks/useDeals";
import { toast } from "sonner";

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

// Helper para mapear prioridades del modal a las del kanban
const PRIORITY_MAP: Record<string, Priority> = {
  "Alta": "high",
  "Media": "medium",
  "Baja": "low"
};

// Helper para mapear stages del modal a las del kanban
const STAGE_MAP: Record<string, Stage> = {
  "Lead": "lead",
  "Qualified": "qualified",
  "Proposal": "proposal",
  "Closed Won": "closed"
};

// Componente de Deal Card con drag
function DraggableDealCard({ deal, onClick, isDemo }: { deal: Deal; onClick: () => void; isDemo: boolean }) {
  const priority = PRIORITY_LABELS[deal.priority];
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: deal.id,
    disabled: isDemo
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card 
        className={`p-3 hover:shadow-md transition-all group relative ${
          isDemo ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={onClick}
        title={isDemo ? "🔒 Modo demo - No se pueden editar deals" : ""}
      >
        {/* Overlay de demo mode en hover */}
        {isDemo && (
          <div className="absolute inset-0 bg-black/5 dark:bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center z-20">
            <div className="bg-black/80 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2">
              <Lock className="w-3 h-3" />
              Modo Demo
            </div>
          </div>
        )}

        {/* Drag handle */}
        {!isDemo && (
          <div
            {...attributes}
            {...listeners}
            className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
          >
            <GripVertical className="w-4 h-4 text-[var(--muted-foreground)]" />
          </div>
        )}

        <div className="pl-3">
          {/* Header: Prioridad + Avatar */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${priority.dot}`} />
              <span className="text-xs text-[var(--muted-foreground)]">{priority.label}</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
              {deal.ownerAvatar}
            </div>
          </div>

          {/* Cliente */}
          <p className="text-xs text-[var(--muted-foreground)] mb-1">{deal.client}</p>
          
{/* Título del deal */}
          <h4 className="font-semibold text-sm text-[var(--foreground)] mb-3 line-clamp-2">
            {deal.title}
          </h4>

          {/* Footer: Valor + Fecha */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-[var(--foreground)] font-semibold">
              <DollarSign className="w-3 h-3" />
              ${(deal.value / 1000).toFixed(0)}K
            </div>
            <div className="flex items-center gap-1 text-[var(--muted-foreground)]">
              <Calendar className="w-3 h-3" />
              {new Date(deal.closeDate).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Área droppable para columnas vacías - CON ALTURA GARANTIZADA
function DroppableEmptyArea({ stageId, isDemo }: { stageId: string; isDemo: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: stageId,
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`min-h-[300px] flex items-center justify-center transition-colors ${
        isOver ? 'bg-[var(--muted)]/50' : ''
      }`}
    >
      <Card className="w-full p-8 text-center border-dashed">
        <p className="text-sm text-[var(--muted-foreground)]">
          {isDemo ? "Sin deals" : "Arrastrá deals aquí"}
        </p>
      </Card>
    </div>
  );
}

export default function ProjectsPage() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const lastMoveRef = useRef<{dealId: string, stage: string} | null>(null);


  // Hooks - integración con localStorage
  const { user } = useAuth();
  const isDemo = user?.role === "demo";
  const { deals: storageDeals, addDeal: addDealToStorage, moveDeal } = useDeals();

  // Convertir deals de storage a formato local
  const deals = useMemo(() => {
    return storageDeals.map(d => {
      const getPriority = (prob: number): Priority => {
        if (prob >= 70) return "high";
        if (prob >= 40) return "medium";
        return "low";
      };

      return {
        id: d.id,
        title: d.title,
        client: d.client,
        value: d.value,
        closeDate: d.expectedCloseDate,
        priority: getPriority(d.probability),
        owner: d.owner,
        ownerAvatar: d.owner.split(' ').map(n => n[0]).join(''),
        stage: d.stage as Stage
      };
    });
  }, [storageDeals]);

  // Dark mode detection para banner
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Organizar deals por stage
  const dealsByStage = useMemo(() => {
    return STAGES.map(stage => ({
      ...stage,
      deals: deals.filter(d => d.stage === stage.id),
      totalValue: deals
        .filter(d => d.stage === stage.id)
        .reduce((sum, d) => sum + d.value, 0)
    }));
  }, [deals]);

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);

  const handleDragStart = (event: any) => {
    const deal = deals.find(d => d.id === event.active.id);
    setActiveDeal(deal || null);
  };

const handleDragOver = (event: { active: { id: string }, over: { id: string } | null }) => {
    const { active, over } = event;
    if (!over) {
      lastMoveRef.current = null;
      return;
    }

    if (isDemo) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const activeDealData = deals.find(d => d.id === activeId);
    if (!activeDealData) return;

    // 1. Verificar si overId ES una columna (stage) directamente
    const isOverAStage = STAGES.some(s => s.id === overId);
    
    // 2. Si es stage, usar ese ID. Si es deal, buscar su stage.
    const overStageId = isOverAStage 
      ? overId 
      : deals.find(d => d.id === overId)?.stage;

    // 3. Guardar para mover en handleDragEnd
    if (overStageId && activeDealData.stage !== overStageId) {
      // Evitar llamadas duplicadas
      if (lastMoveRef.current?.dealId === activeId && lastMoveRef.current?.stage === overStageId) {
        return;
      }
      
      lastMoveRef.current = { dealId: activeId, stage: overStageId };
      moveDeal(activeId, overStageId);
    }
  };

const handleDragEnd = () => {
    if (isDemo && activeDeal) {
      toast.info("Demo Mode", {
        description: "No puedes mover deals en modo demo",
        icon: "🔒"
      });
    }
    setActiveDeal(null);
    lastMoveRef.current = null; // Reset del último movimiento
  };

  // Handler para crear nuevo deal desde el modal
  const handleDealCreated = (newDealFromModal: any) => {
    if (isDemo) {
      toast.info("Demo Mode", {
        description: "La creación de deals está deshabilitada en modo demo"
      });
      return;
    }

    const newDeal = {
      title: newDealFromModal.title,
      client: newDealFromModal.client,
      value: newDealFromModal.value,
      expectedCloseDate: newDealFromModal.deadline,
      stage: STAGE_MAP[newDealFromModal.stage] || "lead",
      probability: newDealFromModal.priority === "Alta" ? 75 : 
                   newDealFromModal.priority === "Media" ? 50 : 25,
      owner: newDealFromModal.assignee === "MG" ? "María García" : 
             newDealFromModal.assignee === "JP" ? "Juan Pérez" : "Ana Silva",
      notes: newDealFromModal.notes
    };

    addDealToStorage(newDeal);
    toast.success("Deal creado", {
      description: `${newDeal.title} agregado al pipeline`
    });
  };

  return (
    <div className="p-6 space-y-6 bg-[var(--background)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Pipeline de Ventas</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            {deals.length} deals activos · ${(totalValue / 1000).toFixed(0)}K total
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle vista */}
          <div className="flex items-center gap-1 p-1 bg-[var(--muted)] rounded-lg">
            <button
              onClick={() => setView("kanban")}
              className={`p-2 rounded transition-colors ${
                view === "kanban" 
                  ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm" 
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded transition-colors ${
                view === "list" 
                  ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm" 
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button variant="ghost" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          
          <Button 
            variant="primary" 
            className={`flex items-center gap-2 ${isDemo ? 'opacity-60 cursor-not-allowed' : ''}`}
            onClick={() => !isDemo && setIsModalOpen(true)}
          >
            {isDemo && <Lock className="w-4 h-4" />}
            <Plus className="w-4 h-4" />
            Nuevo Deal
          </Button>
        </div>
      </div>

      {/* Banner Demo Mode - BI-MODAL */}
      {isDemo && (
        isDark ? (
          <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-100">
                Modo Demo Activo
              </p>
              <p className="text-xs text-blue-300 mt-1">
                Puedes explorar el kanban, pero no puedes mover, crear o editar deals.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg flex items-start gap-3" style={{
            backgroundColor: '#e0f2fe',
            border: '2px solid #06b6d4'
          }}>
            <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0891b2' }} />
            <div>
              <p className="text-sm font-bold" style={{ color: '#000000' }}>
                Modo Demo Activo
              </p>
              <p className="text-xs font-medium mt-1" style={{ color: '#1f2937' }}>
                Puedes explorar el kanban, pero no puedes mover, crear o editar deals.
              </p>
            </div>
          </div>
        )
      )}

      {/* Vista Kanban con Drag & Drop */}
      {view === "kanban" && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dealsByStage.map((stage) => (
              <div key={stage.id} className="flex flex-col">
                
                {/* Header de columna - droppable zone */}
                <div 
                  className="mb-4 p-3 rounded-lg border-2 border-dashed border-transparent hover:border-[var(--border)] transition-colors"
                  style={{ minHeight: '60px' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <h3 className="font-semibold text-[var(--foreground)]">{stage.name}</h3>
                    <span className="text-sm text-[var(--muted-foreground)]">
                      ({stage.deals.length})
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    ${(stage.totalValue / 1000).toFixed(0)}K
                  </p>
                </div>

                {/* Cards de deals */}
                <SortableContext
                  key={`${stage.id}-${stage.deals.length}`}
                  items={stage.deals.map(d => d.id)}
                  strategy={verticalListSortingStrategy}
                  id={stage.id}
                >
                  <div className="space-y-3 flex-1">
                    {stage.deals.length === 0 ? (
                      <DroppableEmptyArea stageId={stage.id} isDemo={isDemo} />
                    ) : (
                      stage.deals.map(deal => (
                        <DraggableDealCard 
                          key={deal.id} 
                          deal={deal}
                          onClick={() => setSelectedDeal(deal)}
                          isDemo={isDemo}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </div>
            ))}
          </div>

          {/* Drag overlay */}
          <DragOverlay>
            {activeDeal ? (
              <Card className="p-3 opacity-90 rotate-2 shadow-xl">
                <p className="font-semibold text-sm">{activeDeal.title}</p>
              </Card>
            ) : null}
          </DragOverlay>
        </DndContext>
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
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
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
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                  {selectedDeal.ownerAvatar}
                </div>
                <div>
                  <p className="font-medium text-[var(--foreground)]">{selectedDeal.owner}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">Sales Representative</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="primary" className="flex-1" onClick={() => setSelectedDeal(null)}>
                Cerrar
              </Button>
            </div>

          </Card>
        </div>
      )}

      {/* Modal Nuevo Deal */}
      <NewDealModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDealCreated={handleDealCreated}
      />

    </div>
  );
}