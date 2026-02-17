import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { Client } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientId: string, updates: Partial<Client>) => void;
  onDelete?: (clientId: string) => void;
  editClient?: Client;
}

export function ClientModal({ isOpen, onClose, onSave, onDelete, editClient }: ClientModalProps) {
  const { user } = useAuth();
  const isDemo = user?.role === 'demo';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'prospect' as Client['status'],
    value: 0
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (editClient) {
      setFormData({
        name: editClient.name,
        email: editClient.email,
        phone: editClient.phone,
        company: editClient.company,
        status: editClient.status,
        value: editClient.value
      });
    }
  }, [editClient, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isDemo) {
      toast.info('Demo Mode', {
        description: 'Los cambios no se guardan en modo demo',
        icon: '🔒'
      });
      return;
    }

    if (!editClient) return;

    onSave(editClient.id, formData);
    toast.success('Cliente actualizado', {
      description: `${formData.name} se actualizó correctamente`
    });
    onClose();
  };

  const handleDelete = () => {
    if (isDemo) {
      toast.info('Demo Mode', {
        description: 'No puedes eliminar clientes en modo demo',
        icon: '🔒'
      });
      setShowDeleteConfirm(false);
      return;
    }

    if (!editClient || !onDelete) return;

    onDelete(editClient.id);
    toast.success('Cliente eliminado', {
      description: `${editClient.name} fue eliminado`
    });
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen || !editClient) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Editar Cliente
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Warning */}
        {isDemo && (
          <div className="mx-6 mt-4 p-3 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg">
            <p className="text-sm text-cyan-700 dark:text-cyan-300">
              <strong>Demo Mode:</strong> Los cambios no se guardarán
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Nombre del cliente *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg 
                       bg-[var(--input)] text-[var(--foreground)]
                       focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent cursor-text"
              placeholder="Acme Corporation"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg 
                       bg-[var(--input)] text-[var(--foreground)]
                       focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent cursor-text"
              placeholder="contact@acme.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg 
                       bg-[var(--input)] text-[var(--foreground)]
                       focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent cursor-text"
              placeholder="+54 11 1234-5678"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Empresa
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg 
                       bg-[var(--input)] text-[var(--foreground)]
                       focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent cursor-text"
              placeholder="Acme Corp"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Estado
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Client['status'] })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg 
                       bg-[var(--input)] text-[var(--foreground)]
                       focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent cursor-pointer"
            >
              <option value="prospect">Prospect</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Valor estimado ($)
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg 
                       bg-[var(--input)] text-[var(--foreground)]
                       focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent cursor-text"
              placeholder="50000"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {/* Botón Eliminar */}
            {onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 border border-red-300 dark:border-red-800 
                         text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 
                         dark:hover:bg-red-900/20 transition-colors font-medium flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            )}

            <div className="flex-1 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-[var(--border)] 
                         text-[var(--foreground)] rounded-lg hover:bg-[var(--muted)] 
                         transition-colors font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 
                         hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg 
                         transition-colors font-medium shadow-lg shadow-cyan-500/30 cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">
              ¿Eliminar cliente?
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              Esta acción no se puede deshacer. El cliente "{editClient.name}" será eliminado permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-[var(--border)] rounded-lg 
                         hover:bg-[var(--muted)] transition-colors font-medium cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white 
                         rounded-lg transition-colors font-medium cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
