# KionCRM 🚀

> **CRM moderno construido con React + TypeScript** — Gestión completa de clientes, proyectos y deals comerciales con dark/light mode, drag & drop y arquitectura escalable.

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://kion-crm.vercel.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## 🌐 Demo en vivo

**[https://kion-crm.vercel.app](https://kion-crm.vercel.app)**

| Credenciales Admin | Credenciales Demo |
|---|---|
| `admin@kion.com` | `demo@kion.com` |
| `admin123` | `demo123` |

> El **modo demo** restringe creación, edición y eliminación de datos, mostrando feedback visual con tooltips y banners informativos.

---

## ✨ Features

### 📊 Dashboard
- Métricas en tiempo real: clientes totales, deals activos, revenue
- Visualización con gráficos
- Loading skeletons durante carga

### 👥 Gestión de Clientes
- Tabla paginada con búsqueda en tiempo real (nombre, email, empresa)
- Sidebar de detalle por cliente con **deals activos calculados dinámicamente**
- CRUD completo: crear, editar y eliminar clientes
- Badges de estado: Activo / Prospect / Inactivo

### 📁 Gestión de Deals (Proyectos)
- **Vista Kanban** con drag & drop entre columnas (Lead → Qualified → Proposal → Closed Won)
- **Vista Lista** en tabla
- Drag & drop funcional incluso en columnas vacías
- Edición completa: título, cliente, valor, etapa, probabilidad (slider), fecha de cierre, notas
- Clientes cargados dinámicamente desde localStorage

### 🌙 Dark / Light Mode
- **ThemeContext** centralizado con Context API
- Transiciones suaves en todos los elementos (0.28s ease)
- Dropdowns (`select/option`) correctamente estilizados en ambos modos
- CSS custom properties para colores en dark y light

### 🔐 Autenticación y Roles
- Roles: Admin y Demo
- Rutas protegidas con React Router DOM v6
- Demo Mode: acciones restringidas con feedback visual (tooltips, badges)
- Persistencia de sesión en localStorage

### 🎨 UX & Interactividad
- `cursor-pointer` en todos los elementos clicables
- `cursor-text` en todos los inputs de escritura
- Hover effects en filas y botones con transiciones suaves
- Toast notifications con Sonner
- Confirmación antes de eliminar (modal secundario)
- Animaciones de entrada/salida en modals (zoom + fade)

---

## 🛠️ Stack Tecnológico

### Core
| Tecnología | Uso |
|---|---|
| React 18 | Biblioteca principal de UI |
| TypeScript | Tipado estático en todo el proyecto |
| Vite | Build tool y dev server |
| React Router DOM v6 | Navegación SPA y rutas protegidas |

### UI & Estilos
| Tecnología | Uso |
|---|---|
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui | Componentes accesibles (Dialog, Button, Input) |
| Radix UI | Primitivos accesibles |
| lucide-react | Iconografía SVG |
| tw-animate-css | Animaciones declarativas |
| class-variance-authority | Variantes de componentes |

### Estado & Datos
| Tecnología | Uso |
|---|---|
| TanStack Query | Server state y caché |
| Context API | Estado global del tema (ThemeContext) |
| localStorage | Persistencia de datos en cliente |
| Custom Hooks | useClients, useDeals, useAuth, useTheme |

### Notificaciones
| Tecnología | Uso |
|---|---|
| Sonner | Toast notifications con soporte dark/light |

---

## 🏗️ Arquitectura

```
src/
├── components/
│   ├── layout/           # AppLayout, Sidebar, Topbar
│   ├── modals/           # NewDealModal, DealModal, ClientModal, NewClientModal
│   └── ui/               # Componentes shadcn
├── contexts/
│   └── ThemeContext.tsx  # Estado global del tema (Context API)
├── features/
│   ├── auth/             # SignIn
│   ├── clients/          # ClientsPage
│   ├── dashboard/        # DashboardPage
│   └── projects/         # ProjectsPage (Kanban + Lista)
├── hooks/
│   ├── useAuth.ts        # Autenticación
│   ├── useClients.ts     # CRUD clientes
│   ├── useDeals.ts       # CRUD deals
│   └── useTheme.ts       # Acceso al ThemeContext
├── lib/
│   ├── providers.tsx     # ThemeProvider + QueryClientProvider
│   ├── storage.ts        # Tipos y datos iniciales
│   └── utils.ts          # Utilidades
└── types/
    └── theme.types.ts    # Interfaces del sistema de temas
```

### Patrones de Diseño Implementados
- **Context API Pattern** — ThemeContext para estado global del tema
- **Custom Hooks Pattern** — Lógica de negocio encapsulada y reutilizable
- **Feature-Based Structure** — Organización por dominio funcional
- **Protected Routes** — Validación de autenticación en navegación
- **Compound Components** — Composición con shadcn/ui

---

## 🎨 Sistema de Diseño

### Paleta de Colores

| Token | Light Mode | Dark Mode |
|---|---|---|
| `--primary` | `#06B6D4` (Cyan) | `#22D3EE` |
| `--background` | `#FAFAFA` | `#12121A` |
| `--card` | `#FFFFFF` | `#1A1A22` |
| `--foreground` | `#0F0F0F` | `#F5F5F5` |
| `--border` | `#E2E2E2` | `rgba(255,255,255,0.10)` |

---

## 🚀 Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/LautaroSnchz/KionCRM.git
cd KionCRM/frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build
```

---

## 📦 Variables de Entorno

No se requieren variables de entorno para desarrollo local. El proyecto usa localStorage para persistencia de datos.

---

## 🗺️ Roadmap

- [ ] Backend con Node.js + Express o Next.js API Routes
- [ ] Base de datos PostgreSQL o MongoDB
- [ ] Autenticación con JWT + refresh tokens
- [ ] Notificaciones en tiempo real con WebSockets
- [ ] Dashboard con gráficos avanzados (Recharts)
- [ ] Filtros avanzados en tablas
- [ ] Exportación a CSV/Excel
- [ ] Tests unitarios con Vitest
- [ ] Tests E2E con Playwright

---

## 👤 Autor

**Lautaro Sanchez**

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-06B6D4)](https://portfolio-woad-nine-22.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?logo=linkedin)](https://linkedin.com/in/lautarosnchz)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?logo=github)](https://github.com/LautaroSnchz)

---

## 📄 Licencia

MIT © 2026 Lautaro Sanchez
