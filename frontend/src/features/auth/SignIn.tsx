import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { AlertCircle, Sun, Moon } from "lucide-react";

export default function SignIn() {
  const navigate = useNavigate();
  const { login, loginAsDemo } = useAuth();

  /* ================= THEME (LOCAL, SIN useTheme) ================= */
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }

    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);

    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  /* ================= FORM STATE ================= */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= HANDLERS ================= */
  const handleDemoAccess = () => {
    setLoading(true);
    loginAsDemo();

    setTimeout(() => {
      navigate("/dashboard");
    }, 300);
  };

  const handleAdminLogin = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const success = login(email, password);

    if (success) {
      setTimeout(() => {
        navigate("/dashboard");
      }, 300);
    } else {
      setError("Credenciales inválidas");
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      {/* Toggle theme */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--muted)]/80 transition-colors"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-[var(--foreground)]" />
        ) : (
          <Moon className="w-5 h-5 text-[var(--foreground)]" />
        )}
      </button>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="KionCRM Logo" 
            className="w-24 h-24 mx-auto mb-4 object-contain"
          />
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">
            KionCRM
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Customer Relationship Management
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg p-8 space-y-6">
          {/* Demo */}
          <button
            onClick={handleDemoAccess}
            disabled={loading}
            className="w-full btn-kion h-12 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Cargando...
              </>
            ) : (
              <>🚀 Acceder como Demo</>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[var(--card)] text-[var(--muted-foreground)]">
                o inicia sesión como Admin
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--input)] text-[var(--foreground)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--input)] text-[var(--foreground)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-[var(--muted)] hover:bg-[var(--muted)]/80 rounded-md"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Credenciales */}
          <div className="pt-4 border-t border-[var(--border)] text-xs text-center text-[var(--muted-foreground)]">
            <p className="mb-2">💡 Credenciales de prueba</p>
            <p className="font-mono">
              Admin: admin@kioncrm.com / Admin123!
            </p>
            <p className="font-mono">Demo: botón superior</p>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--muted-foreground)] mt-6">
          Portfolio project by Lautaro Sanchez
        </p>
      </div>
    </div>
  );
}