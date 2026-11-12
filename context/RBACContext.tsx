"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { getMyAccess, MyAccessResponse } from "@/lib/rbac_api";
import { useAuth } from "@/hooks/useAuth";
import { RBACContextType } from "./rbac-types";
import { getAdminFallbackAccess } from "./rbac-fallback";

export const RBACContext = createContext<RBACContextType | undefined>(undefined);

export function RBACProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser, loading: authLoading } = useAuth();
  const [access, setAccess] = useState<MyAccessResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccess = useCallback(async () => {
    if (!authUser) {
      setAccess(null);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMyAccess();
      setAccess(data);
    } catch (err: any) {
      console.error("Failed to load user RBAC access profile:", err);
      setError(err?.response?.data?.detail || "Could not load access rights");
      const fallback = await getAdminFallbackAccess(authUser);
      if (fallback) setAccess(fallback);
    } finally {
      setIsLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    if (!authLoading) fetchAccess();
  }, [authLoading, fetchAccess]);

  const permissions = useMemo(() => access?.permissions || [], [access]);
  const isSuperAdmin = useMemo(() => Boolean(access?.is_super_admin || permissions.includes("*")), [access, permissions]);

  const hasPermission = useCallback((p: string) => isSuperAdmin || permissions.includes(p), [isSuperAdmin, permissions]);
  const hasAnyPermission = useCallback(
    (...req: string[]) => isSuperAdmin || req.length === 0 || req.some((p) => permissions.includes(p)),
    [isSuperAdmin, permissions]
  );
  const hasAllPermissions = useCallback(
    (...req: string[]) => isSuperAdmin || req.length === 0 || req.every((p) => permissions.includes(p)),
    [isSuperAdmin, permissions]
  );

  const value = useMemo(
    () => ({
      staffUser: access?.user || null,
      permissions,
      isSuperAdmin,
      isLoading: authLoading || isLoading,
      error,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      refreshAccess: fetchAccess,
    }),
    [access, permissions, isSuperAdmin, authLoading, isLoading, error, hasPermission, hasAnyPermission, hasAllPermissions, fetchAccess]
  );

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
}

export function useRBAC() {
  const context = useContext(RBACContext);
  if (!context) throw new Error("useRBAC must be used within an RBACProvider");
  return context;
}
