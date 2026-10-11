"use client";

import React from "react";
import { useRBAC } from "@/hooks/useRBAC";
import { ShieldAlert, ArrowLeft, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
  const { isSuperAdmin, hasPermission, hasAnyPermission, hasAllPermissions, isLoading, staffUser } =
    useRBAC();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#c99335]/20 to-[#e39e3b]/10 animate-pulse border border-[#c99335]/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-6 h-6 text-[#c99335] animate-bounce" />
          </div>
        </div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Verifying Security Clearance...
        </p>
      </div>
    );
  }

  // Super admins bypass all permission checks
  if (isSuperAdmin) {
    return <>{children}</>;
  }

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    hasAccess = requireAll ? hasAllPermissions(...permissions) : hasAnyPermission(...permissions);
  } else {
    // No specific permissions specified, allowed for any authenticated admin
    hasAccess = true;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  const roleName = staffUser?.role?.role_name || "Standard Staff";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto my-12 p-8 md:p-12 bg-white rounded-3xl border border-gray-100 shadow-2xl relative overflow-hidden text-center"
    >
      {/* Decorative luxury background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#c99335]/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#006838]/10 to-transparent rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Luxury Icon Badge */}
      <div className="relative inline-flex p-4 rounded-3xl bg-[#1a1512] text-[#c99335] shadow-xl border border-[#c99335]/30 mb-6">
        <ShieldAlert className="w-10 h-10" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-[#1a1512]" />
        </span>
      </div>

      <h1
        className="text-2xl md:text-3xl font-bold text-[#1a1512] mb-3 tracking-tight"
        style={{ fontFamily: "var(--font-cinzel), serif" }}
      >
        {fallbackTitle}
      </h1>

      <p className="text-sm text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
        {fallbackDescription || (
          <>
            Your current assigned role (
            <span className="font-bold text-[#c99335]">{roleName}</span>) does not have executive
            clearance to access this portal section.
          </>
        )}
      </p>

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold mb-8">
        <Sparkles className="w-3.5 h-3.5 text-[#c99335]" />
        Required Clearance: {permission || (permissions && permissions.join(", ")) || "Executive Admin"}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1a1512] hover:bg-[#2d2520] text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-[#c99335]" />
          Return to Overview
        </Link>
        <Link
          href="/settings"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs border border-gray-200 transition-all shadow-sm"
        >
          View Profile & Rights
        </Link>
      </div>
    </motion.div>
  );
}
