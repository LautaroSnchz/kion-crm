import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, TrendingUp, Activity } from "lucide-react";
import { useState } from "react";

// Badge component
const Badge = ({ children, variant = "default" }: any) => {
  const variants = {
    default: "bg-[var(--muted)] text-[var(--muted-foreground)]",
    success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Data fake
const FAKE_CLIENTS = [
  { id: "1", name: "Acme SA", email: "ventas@acme.com", status: "active", deals: 5, value: "$45,000" },
  { id: "2", name: "Globex Corp", email: "contacto@globex.io", status: "active", deals: 3, value: "$28,500" },
  { id: "3", name: "Initech", email: "info@initech.com", status: "pending", deals: 1, value: "$12,000" },
  { id: "4", name: "Umbrella Co", email: "sales@umbrella.com", status: "active", deals: 8, value: "$92,000" },
];

const STATS = [
  { label: "Total Clientes", value: "124", icon: Users, trend: "+12%", color: "text-purple-600 dark:text-purple-400" },
  { label: "Nuevos este mes", value: "18", icon: UserPlus, trend: "+23%", color: "text-green-600 dark:text-green-400" },
  { label: "Deals activos", value: "47", icon: Activity, trend: "+8%", color: "text-blue-600 dark:text-blue-400" },
  { label: "Revenue total", value: "$892K", icon: TrendingUp, trend: "+15%", color: "text-orange-600 dark:text-orange-400" },
];

export default function ClientsPage() {
  const [q, setQ] = useState("");
  const data = FAKE_CLIENTS.filter(c => 
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.email.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      
      {/* 📊 STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-[var(--muted-foreground)]">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">{stat.trend} vs mes anterior</p>
              </div>
              <div className={`p-3 rounded-lg bg-[var(--muted)] ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 🔍 TABLA DE CLIENTES */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Clientes</h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Gestiona tu cartera de clientes y deals
            </p>
          </div>
          <Button className="btn-kion flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Nuevo Cliente
          </Button>
        </div>

        <div className="flex gap-3 mb-6">
          <Input
            placeholder="Buscar por nombre o email..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="flex-1"
          />
          <Button className="px-4 py-2 border hover:bg-[var(--muted)]">
            Filtros
          </Button>
        </div>

        <div className="kion-divider mb-6" />

        {/* TABLA */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--muted)]">
              <tr>
                <th className="p-4 text-left text-sm font-semibold">Cliente</th>
                <th className="p-4 text-left text-sm font-semibold">Estado</th>
                <th className="p-4 text-left text-sm font-semibold">Deals</th>
                <th className="p-4 text-left text-sm font-semibold">Valor</th>
                <th className="p-4 text-right text-sm font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((client) => (
                <tr key={client.id} className="border-t kion-row-hover transition-colors cursor-pointer group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium group-hover:text-[var(--primary)] transition-colors">
                          {client.name}
                        </p>
                        <p className="text-sm text-[var(--muted-foreground)]">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={client.status === "active" ? "success" : "warning"}>
                      {client.status === "active" ? "Activo" : "Pendiente"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">{client.deals}</span>
                    <span className="text-[var(--muted-foreground)] text-sm ml-1">deals</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold">{client.value}</span>
                  </td>
                  <td className="p-4 text-right">
                    <Button className="text-sm px-3 py-1 text-[var(--primary)] hover:bg-[var(--muted)]">
                      Ver detalles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between mt-4 text-sm text-[var(--muted-foreground)]">
          <p>Mostrando {data.length} de {FAKE_CLIENTS.length} clientes</p>
          <div className="flex gap-2">
            <Button className="px-3 py-1 text-sm border hover:bg-[var(--muted)]">Anterior</Button>
            <Button className="px-3 py-1 text-sm border hover:bg-[var(--muted)]">Siguiente</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}