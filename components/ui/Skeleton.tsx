"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{
        opacity: [0.5, 1, 0.5],
        backgroundPosition: ["200% 0", "-200% 0"],
      }}
      transition={{
        opacity: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        },
        backgroundPosition: {
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        },
      }}
      className={cn(
        "rounded-xl bg-gray-100 dark:bg-gray-800",
        "bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10",
        "bg-[length:200%_100%]",
        className
      )}
      {...props}
    />
  );
}

export function ButtonShimmer({
  children,
  className,
  isLoading,
}: {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={cn("relative overflow-hidden cursor-not-allowed opacity-80", className)}>
      <div className="absolute inset-0 flex items-center justify-center opacity-0">
         {/* Keeps the layout size intact, hiding children */}
        {children}
      </div>
      <motion.div
        className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/40 to-transparent dark:via-white/20 bg-[length:200%_100%]"
        animate={{
          backgroundPosition: ["200% 0", "-200% 0"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />
      <div className="relative z-20 flex items-center justify-center h-full w-full">
         <span className="text-transparent">{children}</span> {/* Placeholder */}
      </div>
    </div>
  );
}
