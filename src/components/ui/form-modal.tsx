"use client";

import * as React from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { Loader2 } from "lucide-react";

interface FormModalProps {
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (e: React.FormEvent) => void | Promise<void>;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  trigger?: React.ReactNode;
  children: React.ReactNode;
}

export function FormModal({
  title,
  description,
  open,
  onOpenChange,
  onSubmit,
  submitText = "Submit",
  cancelText = "Cancel",
  loading = false,
  trigger,
  children,
}: FormModalProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      await onSubmit(e);
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
      title={title}
      description={description}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            disabled={loading}
            type="button"
          >
            {cancelText}
          </Button>
          <Button
            type="submit"
            form="form-modal"
            disabled={loading}
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {submitText}
          </Button>
        </div>
      }
    >
      <form id="form-modal" onSubmit={handleSubmit}>
        {children}
      </form>
    </Modal>
  );
}
