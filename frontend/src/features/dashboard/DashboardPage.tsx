import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from "recharts";
import { MetricCardSkeleton, ChartSkeleton } from "@/components/ui/Skeletons";
import { useDeals } from "@/hooks/useDeals";
import { useClients } from "@/hooks/useClients";

// Componentes base
const Card = ({ className = "", children }: any) => (
  <div className={`bg-[var(--card)] border border-[var(--border)] rounded-lg ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = "default" }: { children: any; variant?: 'default' | 'success' | 'warning' | 'info' }) => {
  const variants = {
    default: "bg-[var(--muted)] text-[var(--muted-foreground)]",
    success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Data FAKE para gráfico y actividad (decorativo)
const REVENUE_DATA = [
  { month: "Ene", revenue: 45000, target: 50000 },
  { month: "Feb", revenue: 52000, target: 55000 },
  { month: "Mar", revenue: 48000, target: 58000 },
  { month: "Abr", revenue: 61000, target: 60000 },
  { month: "May", revenue: 68000, target: 65000 },
  { month: "Jun", revenue: 75000, target: 70000 },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "deal", action: "cerró un deal", client: "Acme Corp", value: "$45,000", time: "Hace 5 min", icon: CheckCircle2, color: "text-green-500" },
  { id: 2, type: "call", action: "llamada con", client: "TechStart", time: "Hace 15 min", icon: Phone, color: "text-blue-500" },
  { id: 3, type: "email", action: "envió propuesta a", client: "Global Inc", time: "Hace 1 hora", icon: Mail, color: "text-purple-500" },
  { id: 4, type: "meeting", action: "reunión agendada con", client: "Initech", time: "Hace 2 horas", icon: Calendar, color: "text-orange-500" },
];

const TOP_PERFORMERS = [
  { id: 1, name: "Simon Belmont", deals: 12, revenue: "$340K", avatar: "SB", trend: "+23%" },
  { id: 2, name: "Sofía Márquez", deals: 10, revenue: "$285K", avatar: "SM", trend: "+18%" },
  { id: 3, name: "Orion Castillo", deals: 8, revenue: "$220K", avatar: "OC", trend: "+15%" },
];

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("6m");
  const [loading, setLoading] = useState(true);
  
  // 📊 Hooks para datos DINÁMICOS y REACTIVOS
  const { deals } = useDeals();
  const { clients } = useClients();

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Helper: normaliza stage para comparar
  // storage usa 'closed', Kanban/NewDeal usa 'Closed Won'
  const isClosed = (stage: string) => stage === 'closed' || stage === 'Closed Won';
  const isLead = (stage: string) => stage === 'lead' || stage === 'Lead';
  const isQualified = (stage: string) => stage === 'qualified' || stage === 'Qualified';
  const isProposal = (stage: string) => stage === 'proposal' || stage === 'Proposal';

  // 📈 Métricas calculadas en tiempo real desde los hooks
  const totalRevenue = deals
    .filter(d => isClosed(d.stage))
    .reduce((sum, d) => sum + (d.value || 0), 0);

  const activeDeals = deals.filter(d => !isClosed(d.stage)).length;

  const activeClients = clients.filter(c => c.status === 'active').length;

  const closedWonDeals = deals.filter(d => isClosed(d.stage)).length;
  const winRate = deals.length > 0 ? Math.round((closedWonDeals / deals.length) * 100) : 0;

  // Pipeline dinámico — compatible con ambos formatos de stage
  const pipelineStages = [
    { id: 'lead', name: 'Lead', color: 'bg-blue-500', deals: deals.filter(d => isLead(d.stage)) },
    { id: 'qualified', name: 'Qualified', color: 'bg-purple-500', deals: deals.filter(d => isQualified(d.stage)) },
    { id: 'proposal', name: 'Proposal', color: 'bg-orange-500', deals: deals.filter(d => isProposal(d.stage)) },
    { id: 'closed', name: 'Closed Won', color: 'bg-green-500', deals: deals.filter(d => isClosed(d.stage)) },
  ];

  const BASE_WIN_RATE = 17;
  const winRateDiff = winRate - BASE_WIN_RATE;
  const winRateTrend = winRateDiff >= 0 ? "up" : "down";
  const winRateChange = `${winRateDiff >= 0 ? "+" : ""}${winRateDiff.toFixed(1)}%`;

  // Métricas dinámicas para las cards
  const quickStats = [
    { 
      label: "Revenue Total", 
      value: `$${(totalRevenue / 1000).toFixed(0)}K`, 
      change: "+15.3%", 
      trend: "up", 
      icon: DollarSign,
      color: "text-green-500"
    },
    { 
      label: "Deals Activos", 
      value: activeDeals.toString(), 
      change: "+8.2%", 
      trend: "up", 
      icon: Target,
      color: "text-blue-500"
    },
    { 
      label: "Clientes Activos", 
      value: activeClients.toString(), 
      change: "+23.1%", 
      trend: "up", 
      icon: Users,
      color: "text-purple-500"
    },
    { 
      label: "Win Rate", 
      value: `${winRate}%`, 
      change: winRateChange, 
      trend: winRateTrend, 
      icon: TrendingUp,
      color: "text-orange-500"
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-[var(--background)] min-h-screen">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Dashboard</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            Resumen de actividad y métricas clave
          </p>
        </div>
        <div className="flex gap-2">
          {["1m", "3m", "6m", "1y"].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedPeriod === period
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                  : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/80"
              }`}
            >
              {period.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats DINÁMICAS */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat) => (
            <Card key={stat.label} className="p-5 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-[var(--muted-foreground)]">{stat.label}</p>
                  <p className="text-3xl font-bold text-[var(--foreground)]">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-[var(--muted-foreground)] ml-1">vs mes anterior</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-[var(--muted)] ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Revenue Chart & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart (DECORATIVO - histórico simulado) */}
        {loading ? (
          <div className="lg:col-span-2">
            <ChartSkeleton />
          </div>
        ) : (
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--foreground)]">Revenue Overview</h3>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">Ingresos mensuales vs objetivo</p>
              </div>
              <Badge variant="success">+15% vs target</Badge>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "var(--card)", 
                    border: "1px solid var(--border)",
                    borderRadius: "8px"
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#06B6D4" 
                  strokeWidth={3}
                  fill="url(#colorRevenue)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Top Performers (DECORATIVO) */}
        {loading ? (
          <Card className="p-6">
            <div className="h-6 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-32 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--muted-foreground)]/20 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-24" />
                    <div className="h-3 bg-[var(--muted-foreground)]/20 rounded animate-pulse w-32" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Top Performers</h3>
            <div className="space-y-4">
              {TOP_PERFORMERS.map((performer, index) => (
                <div key={performer.id} className="flex items-center gap-3 group cursor-pointer">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                        {performer.avatar}
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                          🏆
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                      {performer.name}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {performer.deals} deals · {performer.revenue}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4" />
                    {performer.trend}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Pipeline Visual DINÁMICO */}
      {!loading && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Sales Pipeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {pipelineStages.map((stage) => {
              const stageValue = stage.deals.reduce((sum, d) => sum + d.value, 0);
              return (
                <div 
                  key={stage.id} 
                  className="group cursor-pointer"
                >
                  <div className="p-4 rounded-lg bg-[var(--muted)] hover:bg-[var(--muted)]/70 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm text-[var(--foreground)]">{stage.name}</h4>
                      <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                    </div>
                    <p className="text-2xl font-bold text-[var(--foreground)] mb-1">{stage.deals.length}</p>
                    <p className="text-sm text-[var(--muted-foreground)] mb-3">
                      ${(stageValue / 1000).toFixed(0)}K
                    </p>
                    
                    <div className="space-y-2">
                      {stage.deals.slice(0, 2).map((deal, idx) => (
                        <div 
                          key={idx}
                          className="text-xs px-2 py-1 rounded bg-[var(--background)] text-[var(--foreground)] truncate"
                        >
                          {deal.title}
                        </div>
                      ))}
                      {stage.deals.length > 2 && (
                        <div className="text-xs text-[var(--muted-foreground)]">
                          +{stage.deals.length - 2} más
                        </div>
                      )}
                      {stage.deals.length === 0 && (
                        <div className="text-xs text-[var(--muted-foreground)] italic">
                          Sin deals
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Recent Activity (DECORATIVO) */}
      {!loading && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-6">Actividad Reciente</h3>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 group cursor-pointer hover:bg-[var(--muted)]/50 p-3 rounded-lg transition-all">
                <div className={`p-2 rounded-lg bg-[var(--muted)] ${activity.color}`}>
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[var(--foreground)]">
                    <span className="font-medium">Usuario</span> {activity.action}{" "}
                    <span className="font-medium text-[var(--primary)]">{activity.client}</span>
                    {activity.value && <span className="text-[var(--muted-foreground)]"> · {activity.value}</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-[var(--muted-foreground)]" />
                    <span className="text-xs text-[var(--muted-foreground)]">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

    </div>
  );
}
