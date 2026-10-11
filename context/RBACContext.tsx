"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { getMyAccess, MyAccessResponse, StaffUser } from "@/lib/rbac_api";
import { useAuth } from "@/hooks/useAuth";

interface RBACContextType {
  staffUser: StaffUser | null;
  permissions: string[];
  isSuperAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (...permissions: string[]) => boolean;
  hasAllPermissions: (...permissions: string[]) => boolean;
  refreshAccess: () => Promise<void>;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

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
      // Fallback: If legacy admin or endpoint error, we check if Firebase claims or email indicates admin
      setError(err?.response?.data?.detail || "Could not load access rights");
      // Fallback super admin for admin@jmc.org
      if (authUser.email === "admin@jmc.org") {
        setAccess({
          user: {
            id: authUser.uid,
            email: authUser.email || "admin@jmc.org",
            username: "admin",
            full_name: authUser.displayName || "Executive Administrator",
            is_active: true,
            is_admin: true,
            is_super_admin: true,
            role: { id: "super", role_name: "Super Admin", color: "#c99335", is_system: true },
          },
          permissions: ["*"],
          is_super_admin: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    if (!authLoading) {
      fetchAccess();
    }
  }, [authLoading, fetchAccess]);

  const permissions = useMemo(() => access?.permissions || [], [access]);
  const isSuperAdmin = useMemo(() => {
    if (!access) return false;
    return access.is_super_admin || permissions.includes("*");
  }, [access, permissions]);

  const hasPermission = useCallback(
    (permission: string) => {
      if (isSuperAdmin) return true;
      return permissions.includes(permission);
    },
    [isSuperAdmin, permissions]
  );

  const hasAnyPermission = useCallback(
    (...required: string[]) => {
      if (isSuperAdmin) return true;
      if (required.length === 0) return true;
      return required.some((p) => permissions.includes(p));
    },
    [isSuperAdmin, permissions]
  );

  const hasAllPermissions = useCallback(
    (...required: string[]) => {
      if (isSuperAdmin) return true;
      if (required.length === 0) return true;
      return required.every((p) => permissions.includes(p));
    },
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
    [
      access,
      permissions,
      isSuperAdmin,
      authLoading,
      isLoading,
      error,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      fetchAccess,
    ]
  );

  return <RBACContext.Provider value={value}>{children}</RBACContext.Provider>;
}

export function useRBAC() {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error("useRBAC must be used within an RBACProvider");
  }
  return context;
}
