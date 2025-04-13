"use client";

import * as React from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertModalProps {
  type?: AlertType;
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

const alertConfig: Record<AlertType, { icon: React.ElementType; className: string }> = {
  success: { icon: CheckCircle, className: "text-green-500" },
  error: { icon: XCircle, className: "text-red-500" },
  warning: { icon: AlertTriangle, className: "text-yellow-500" },
  info: { icon: Info, className: "text-blue-500" },
};

export function AlertModal({
  type = "info",
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}: AlertModalProps) {
  const { icon: Icon, className } = alertConfig[type];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="flex items-center gap-2">
          <Icon className={cn("h-5 w-5", className)} />
          <span>{title}</span>
        </div>
      }
      description={description}
      footer={
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              {cancelText}
            </Button>
          )}
          {onConfirm && (
            <Button
              onClick={onConfirm}
              disabled={loading}
              variant={type === "error" ? "destructive" : "default"}
            >
              {confirmText}
            </Button>
          )}
        </div>
      }
    />
  );
}
