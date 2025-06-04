// frontend/app/context/AuthContext.tsx
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
  // state to hold the current role
  const [role, setRole] = useState<Role>("guest");

  // isAuthenticated is true if role is either 'user' or 'admin', false for 'guest'
  const isAuthenticated = role === "user" || role === "admin";

  // A very simple signIn function that:
  //  - if username === "admin@example.com" & password === "adminpass", set role = "admin"
  //  - otherwise, if username/password are nonempty, set role = "user"
  //  - returns true if login succeeded, false if it failed (e.g. blank credentials)
  const signIn = (username: string, password: string): boolean => {
    if (!username.trim() || !password.trim()) {
      return false; // no blank username/password
    }

    // hard-coded “admin” check:
    if (
      username.trim().toLowerCase() === "admin@example.com" &&
      password.trim() === "adminpass"
    ) {
      setRole("admin");
      return true;
    }

    // any other nonempty credentials → regular "user"
    setRole("user");
    return true;
  };

  // Skip function simply sets role = "guest"
  const skip = () => {
    setRole("guest");
  };

  // signOut clears everything back to guest
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
