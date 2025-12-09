export function getAuth() {
  const raw = localStorage.getItem("kion.auth");
  return raw ? JSON.parse(raw) as { token: string } : null;
}
export function isAuthenticated() { return !!getAuth()?.token }
