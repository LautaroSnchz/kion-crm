import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="p-4">Clientes activos: 12</Card>
      <Card className="p-4">Proyectos en curso: 5</Card>
      <Card className="p-4">Ingresos estimados: $1.2M</Card>
    </div>
  );
}
