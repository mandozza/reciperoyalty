"use client";

import { useEffect, useState } from "react";
import { Modal } from "../../../components/ui/modal";
import { AlertModal } from "../../../components/ui/alert-modal";
import { FormModal } from "../../../components/ui/form-modal";
import { useModal } from "@/hooks/use-modal";

export function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false);
  const { type, isOpen, onClose, data } = useModal();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AlertModal
        open={isOpen && type === "alert"}
        onOpenChange={onClose}
        title={data.title}
        description={data.description}
        onConfirm={data.onConfirm}
        onCancel={data.onCancel}
        type={data.alertType}
        confirmText={data.confirmText}
        cancelText={data.cancelText}
        loading={data.loading}
      />

      <FormModal
        open={isOpen && type === "form"}
        onOpenChange={onClose}
        title={data.title}
        description={data.description}
        onSubmit={data.onSubmit}
        submitText={data.submitText}
        cancelText={data.cancelText}
        loading={data.loading}
      >
        {data.children}
      </FormModal>

      {/* For custom modals */}
      {type && !["alert", "form"].includes(type) && (
        <Modal
          open={isOpen}
          onOpenChange={onClose}
          title={data.title}
          description={data.description}
          footer={data.footer}
        >
          {data.children}
        </Modal>
      )}
    </>
  );
}
