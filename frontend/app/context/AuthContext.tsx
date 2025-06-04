// app/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Role = "guest" | "user" | "admin";

interface AuthContextType {
  role: Role;
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => boolean;
  skip: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [role, setRole] = useState<Role>("guest");
  const isAuthenticated = role === "user" || role === "admin";

  const signIn = (username: string, password: string): boolean => {
    if (!username.trim() || !password.trim()) {
      return false;
    }
    // Simple “admin” check:
    if (
      username.trim().toLowerCase() === "admin@example.com" &&
      password.trim() === "adminpass"
    ) {
      setRole("admin");
      return true;
    }
    // Any other nonempty credentials → “user”
    setRole("user");
    return true;
  };

  const skip = () => {
    setRole("guest");
  };

  const signOut = () => {
    setRole("guest");
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        isAuthenticated,
        signIn,
        skip,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
