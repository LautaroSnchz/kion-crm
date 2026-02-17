import { useState, useEffect } from 'react';
import { X, Trash2, Lock } from 'lucide-react';
import type { Deal } from '@/lib/storage';
import { useAuth } from '@/hooks/useAuth';
import { useClients } from '@/hooks/useClients';
import { useTheme } from '@/hooks/useTheme';
import { toast } from 'sonner';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dealId: string, updates: Partial<Deal>) => void;
  onDelete?: (dealId: string) => void;
  editDeal?: Deal;
}

export function DealModal({ isOpen, onClose, onSave, onDelete, editDeal }: DealModalProps) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const isDemo = user?.role === 'demo';
  
  // Clientes dinámicos desde localStorage
  const { clients } = useClients();
  const clientNames = clients.map(c => c.name);

  const [formData, setFormData] = useState({
    title: '',
    client: '',
    value: 0,
    stage: 'lead' as Deal['stage'],
    probability: 20,
    expectedCloseDate: '',
    owner: user?.name || 'Admin User',
    notes: ''
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (editDeal) {
      setFormData({
        title: editDeal.title,
        client: editDeal.client,
        value: editDeal.value,
        stage: editDeal.stage,
        probability: editDeal.probability,
        expectedCloseDate: editDeal.expectedCloseDate,
        owner: editDeal.owner,
        notes: editDeal.notes || ''
      });
    }
  }, [editDeal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isDemo) {
      toast.info('Demo Mode', {
        description: 'Los cambios no se guardan en modo demo',
        icon: '🔒'
      });
      return;
    }

    if (!editDeal) return;

    onSave(editDeal.id, formData);
    toast.success('Deal actualizado', {
      description: `${formData.title} se actualizó correctamente`
    });
    onClose();
  };

  const handleDelete = () => {
    if (isDemo) {
      toast.info('Demo Mode', {
        description: 'No puedes eliminar deals en modo demo',
        icon: '🔒'
      });
      setShowDeleteConfirm(false);
      return;
    }

    if (!editDeal || !onDelete) return;

    onDelete(editDeal.id);
    toast.success('Deal eliminado', {
      description: `${editDeal.title} fue eliminado`
    });
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen || !editDeal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Editar Deal
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
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Título del deal *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg 
                       bg-[var(--input)] text-[var(--foreground)]
                       focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent cursor-text"
              placeholder="Migración Cloud Platform"
            />
          </div>

          {/* Client - DINÁMICO */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Cliente *
            </label>
            <select
              required
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              style={{ colorScheme: isDark ? 'dark' : 'light' }}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg 
                       bg-[var(--input)] text-[var(--foreground)]
                       focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent cursor-pointer"
            >
              <option value="">Seleccionar cliente</option>
              {clientNames.map(client => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Valor (USD) *
            </label>
            <input
              type="number"
              required
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

          {/* Stage */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Etapa
            </label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as Deal['stage'] })}
              style={{ colorScheme: isDark ? 'dark' : 'light' }}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg 
                       bg-[var(--input)] text-[var(--foreground)]
                       focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent cursor-pointer"
            >
              <option value="lead">Lead</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="closed">Closed Won</option>
            </select>
          </div>

          {/* Probability */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Probabilidad: {formData.probability}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: parseInt(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* Expected Close Date */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Fecha de cierre estimada
            </label>
            <input
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg 
                       bg-[var(--input)] text-[var(--foreground)]
                       focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent cursor-text"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Notas
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-[var(--border)] rounded-lg 
                       bg-[var(--input)] text-[var(--foreground)]
                       focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent resize-none cursor-text"
              placeholder="Información adicional sobre este deal..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {/* Botón Eliminar */}
{onDelete && (
  <div className="relative group">
    <button
      type="button"
      onClick={() => {
        if (isDemo) {
          toast.info('Demo Mode', {
            description: 'No puedes eliminar deals en modo demo',
            icon: '🔒'
          });
          return;
        }
        setShowDeleteConfirm(true);
      }}
      className={`px-4 py-2 border border-red-300 dark:border-red-800 
               text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 
               dark:hover:bg-red-900/20 transition-colors font-medium flex items-center gap-2
               ${isDemo ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      title={isDemo ? "🔒 Deshabilitado en modo demo" : ""}
    >
      {isDemo && <Lock className="w-4 h-4" />}
      <Trash2 className="w-4 h-4" />
      Eliminar
    </button>
    {isDemo && (
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        🔒 Deshabilitado en modo demo
      </div>
    )}
  </div>
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
              ¿Eliminar deal?
            </h3>
            <p className="text-sm text-[var(--muted-foreground)] mb-4">
              Esta acción no se puede deshacer. El deal "{editDeal.title}" será eliminado permanentemente.
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
