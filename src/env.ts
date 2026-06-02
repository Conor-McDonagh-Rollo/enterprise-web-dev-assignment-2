const requireEnv = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value as string;
};

export const TMDB_API_KEY = requireEnv("VITE_TMDB_API_KEY");
export const AUTH_API_URL = requireEnv("VITE_AUTH_API_URL");
export const MOVIES_API_URL = requireEnv("VITE_MOVIES_API_URL");
