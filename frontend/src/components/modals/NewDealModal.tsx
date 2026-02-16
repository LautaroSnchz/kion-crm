import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useClients } from "@/hooks/useClients";
import { useTheme } from "@/hooks/useTheme";


interface NewDealModalProps {
  open: boolean;
  onClose: () => void;
  onDealCreated: (deal: any) => void;
}

const PRIORITIES = ["Alta", "Media", "Baja"];
const ASSIGNEES = [
  { id: "SB", name: "Simon Belmont" },
  { id: "SM", name: "Sofía Márquez" },
  { id: "OC", name: "Orion Castillo" }
];
const STAGES = ["Lead", "Qualified", "Proposal", "Closed Won"];

export default function NewDealModal({ open, onClose, onDealCreated }: NewDealModalProps) {
  const { isDark } = useTheme();
console.log('NewDealModal isDark:', isDark);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    client: "",
    title: "",
    value: "",
    priority: "Media",
    assignee: "MG",
    deadline: "",
    stage: "Lead"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 🔥 DINÁMICO: Cargar clientes desde localStorage
  const { clients } = useClients();
  const clientNames = clients.map(c => c.name);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.client.trim()) {
      newErrors.client = "El cliente es obligatorio";
    }

    if (!formData.title.trim()) {
      newErrors.title = "El título es obligatorio";
    }

    if (!formData.value.trim()) {
      newErrors.value = "El valor es obligatorio";
    } else if (isNaN(Number(formData.value)) || Number(formData.value) <= 0) {
      newErrors.value = "Ingrese un valor válido mayor a 0";
    }

    if (!formData.deadline) {
      newErrors.deadline = "La fecha estimada es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Por favor, corrige los errores del formulario");
      return;
    }

    setLoading(true);

    // Simular API call
    setTimeout(() => {
      const newDeal = {
        id: Date.now().toString(),
        stage: formData.stage,
        priority: formData.priority,
        client: formData.client,
        title: formData.title,
        value: Number(formData.value),
        date: new Date(formData.deadline).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
        assignee: formData.assignee,
        deadline: formData.deadline
      };

      onDealCreated(newDeal);
      toast.success(`Deal "${formData.title}" creado exitosamente`);
      
      // Reset form
      setFormData({
        client: "",
        title: "",
        value: "",
        priority: "Media",
        assignee: "MG",
        deadline: "",
        stage: "Lead"
      });
      setErrors({});
      setLoading(false);
      onClose();
    }, 800);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[var(--foreground)]">Nuevo Deal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Cliente - DINÁMICO */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              Cliente <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.client}
              onChange={(e) => handleChange("client", e.target.value)}
              disabled={loading}
              style={{ colorScheme: isDark ? 'dark' : 'light' }}
              className={`w-full px-3 py-2 border rounded-md bg-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${
                errors.client ? "border-red-500" : "border-[var(--border)]"
              }`}
            >
              <option value="">Seleccionar cliente...</option>
              {clientNames.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
            {errors.client && (
              <p className="text-xs text-red-500 mt-1">{errors.client}</p>
            )}
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              Título del proyecto <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Ej: Migración Cloud Platform"
              disabled={loading}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              Valor (USD) <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.value}
              onChange={(e) => handleChange("value", e.target.value)}
              placeholder="45000"
              disabled={loading}
              className={errors.value ? "border-red-500" : ""}
              min="0"
              step="1000"
            />
            {errors.value && (
              <p className="text-xs text-red-500 mt-1">{errors.value}</p>
            )}
          </div>

          {/* Row: Prioridad + Stage */}
          <div className="grid grid-cols-2 gap-4">
            {/* Prioridad */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Prioridad
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                disabled={loading}
                style={{ colorScheme: isDark ? 'dark' : 'light' }}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                {PRIORITIES.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            {/* Stage */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Etapa
              </label>
              <select
                value={formData.stage}
                onChange={(e) => handleChange("stage", e.target.value)}
                disabled={loading}
                style={{ colorScheme: isDark ? 'dark' : 'light' }}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                {STAGES.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row: Responsable + Fecha */}
          <div className="grid grid-cols-2 gap-4">
            {/* Responsable */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Responsable
              </label>
              <select
                value={formData.assignee}
                onChange={(e) => handleChange("assignee", e.target.value)}
                disabled={loading}
                style={{ colorScheme: isDark ? 'dark' : 'light' }}
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--input)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              >
                {ASSIGNEES.map(assignee => (
                  <option key={assignee.id} value={assignee.id}>
                    {assignee.name} ({assignee.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Fecha estimada <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
                disabled={loading}
                className={errors.deadline ? "border-red-500" : ""}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.deadline && (
                <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="kion"
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creando...
                </>
              ) : (
                "Crear Deal"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
