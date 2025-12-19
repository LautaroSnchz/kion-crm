
export type UserRole = "admin" | "demo";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  token: string;
}

// Usuarios de prueba
export const DEMO_USERS = {
  admin: {
    email: "admin@kioncrm.com",
    password: "Admin123!",
    name: "Admin User",
    role: "admin" as UserRole
  },
  demo: {
    email: "demo@kioncrm.com", 
    password: "demo",
    name: "Demo User",
    role: "demo" as UserRole
  }
};

// Guardar usuario en localStorage
export function setAuth(user: User) {
  localStorage.setItem("kion.auth", JSON.stringify(user));
}

// Obtener usuario actual
export function getAuth(): User | null {
  const raw = localStorage.getItem("kion.auth");
  if (!raw) return null;
  
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Verificar si está autenticado
export function isAuthenticated(): boolean {
  return getAuth() !== null;
}

// Verificar si es admin
export function isAdmin(): boolean {
  const user = getAuth();
  return user?.role === "admin";
}

// Verificar si es demo
export function isDemo(): boolean {
  const user = getAuth();
  return user?.role === "demo";
}

// Logout
export function logout() {
  localStorage.removeItem("kion.auth");
}

// Login (simulado)
export function login(email: string, password: string): User | null {
  // Verificar admin
  if (email === DEMO_USERS.admin.email && password === DEMO_USERS.admin.password) {
    return {
      id: "admin-1",
      email: DEMO_USERS.admin.email,
      name: DEMO_USERS.admin.name,
      role: DEMO_USERS.admin.role,
      token: btoa(`${email}:${Date.now()}`) // Token fake
    };
  }
  
  // Verificar demo
  if (email === DEMO_USERS.demo.email && password === DEMO_USERS.demo.password) {
    return {
      id: "demo-1",
      email: DEMO_USERS.demo.email,
      name: DEMO_USERS.demo.name,
      role: DEMO_USERS.demo.role,
      token: btoa(`${email}:${Date.now()}`)
    };
  }
  
  return null;
}

// Login demo directo (sin password)
export function loginAsDemo(): User {
  return {
    id: "demo-1",
    email: DEMO_USERS.demo.email,
    name: DEMO_USERS.demo.name,
    role: DEMO_USERS.demo.role,
    token: btoa(`demo:${Date.now()}`)
  };
}