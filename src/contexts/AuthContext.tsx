import { createContext, useContext, useState, type ReactNode } from "react";
import { loginUser, logoutUser, registerUser } from "../api/authApi";

type AuthUser = { userId: string; token: string };

type AuthContextType = {
  user: AuthUser | null;
  login: (userId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userId: string, password: string, name: string) => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "movies_token";
const USER_KEY = "movies_user";

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const userId = sessionStorage.getItem(USER_KEY);
    if (!token || !userId || isTokenExpired(token)) {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      return null;
    }
    return { token, userId };
  });

  const login = async (userId: string, password: string) => {
    const { token } = await loginUser(userId, password);
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, userId);
    setUser({ userId, token });
  };

  const logout = async () => {
    if (user?.token) {
      try {
        await logoutUser(user.token);
      } catch {
        /* ignore */
      }
    }
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const register = async (userId: string, password: string, name: string) => {
    await registerUser(userId, password, name);
    await login(userId, password);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
