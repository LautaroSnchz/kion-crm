interface Environment {
  readonly apiUrl: string;
  readonly appName: string;
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;
}

function getEnvVar(key: string, fallback?: string): string {
  const value = import.meta.env[key];
  if (value !== undefined) return String(value);
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing required environment variable: ${key}`);
}

export const env: Environment = {
  apiUrl: getEnvVar("VITE_API_URL", "http://localhost:3000/api"),
  appName: getEnvVar("VITE_APP_NAME", "KionCRM"),
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;