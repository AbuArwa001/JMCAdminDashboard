"use client";

import React from "react";
import { useRBAC } from "@/hooks/useRBAC";
import { PermissionLoadingView } from "./PermissionLoadingView";
import { PermissionDeniedView } from "./PermissionDeniedView";

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export default function PermissionGuard({
  permission,
  permissions,
  requireAll = false,
  children,
  fallbackTitle = "Access Restricted",
  fallbackDescription,
}: PermissionGuardProps) {
  const { isSuperAdmin, hasPermission, hasAnyPermission, hasAllPermissions, isLoading, staffUser } = useRBAC();

  if (isLoading) return <PermissionLoadingView />;
  if (isSuperAdmin) return <>{children}</>;

  let hasAccess = false;
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll ? hasAllPermissions(...permissions) : hasAnyPermission(...permissions);
  } else {
    hasAccess = true;
  }

  if (hasAccess) return <>{children}</>;

  const roleName = staffUser?.role?.role_name || "Standard Staff";
  const clearanceText = permission || (permissions && permissions.join(", ")) || "Executive Admin";

  return (
    <PermissionDeniedView
      fallbackTitle={fallbackTitle}
      fallbackDescription={fallbackDescription}
      roleName={roleName}
      clearanceText={clearanceText}
    />
  );
}
