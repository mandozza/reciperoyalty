"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface SuspenseBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SuspenseBoundary({
  children,
  fallback = (
    <div className="flex h-[200px] items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  ),
}: SuspenseBoundaryProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
