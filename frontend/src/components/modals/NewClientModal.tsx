import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NewClientModalProps {
  open: boolean;
  onClose: () => void;
  onClientCreated: (client: any) => void;
}

export default function NewClientModal({ open, onClose, onClientCreated }: NewClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email invÃ¡lido";
    }

    if (!formData.company.trim()) {
      newErrors.company = "La empresa es obligatoria";
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
      const newClient = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "+54 11 XXXX-XXXX",
        company: formData.company,
        industry: formData.industry || "General",
        status: "active",
        deals: 0,
        value: 0,
        lastContact: "Ahora mismo"
      };

      onClientCreated(newClient);
      toast.success(`Cliente "${formData.name}" creado exitosamente`);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        industry: ""
      });
      setErrors({});
      setLoading(false);
      onClose();
    }, 800);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo Cliente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Wick"
              disabled={loading}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="John@empresa.com"
              disabled={loading}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Telefono */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              Telefono
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+54 11 1234-5678"
              disabled={loading}
            />
          </div>

          {/* Empresa */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              Empresa <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
              placeholder="Empresa SA"
              disabled={loading}
              className={errors.company ? "border-red-500" : ""}
            />
            {errors.company && (
              <p className="text-xs text-red-500 mt-1">{errors.company}</p>
            )}
          </div>

          {/* Industria */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              Industria
            </label>
            <Input
              value={formData.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
              placeholder="Technology, Finance, etc."
              disabled={loading}
            />
          </div>

          <DialogFooter className="gap-2">
<button
  type="button"
  onClick={onClose}
  disabled={loading}
  className="inline-flex items-center justify-center h-9 px-4 py-2 text-sm border border-[var(--border)] bg-background text-[var(--foreground)] hover:bg-[var(--muted)] rounded-md transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
>
  Cancelar
</button>
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
                "Crear Cliente"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
