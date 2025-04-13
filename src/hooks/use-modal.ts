"use client";

import { create } from "zustand";

type ModalType = "alert" | "form" | "confirmation" | string;

interface ModalData {
  title?: string;
  description?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  [key: string]: any;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>()((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type: ModalType, data: ModalData = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false, data: {} }),
}));
