"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Toast } from "flowbite-react";
import { FaInfoCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

type MessageType = "info" | "success" | "error";

interface Toast {
  message: string;
  type: MessageType;
}

interface ToastContextType {
  toasts: Toast[];
  showToaster: (message: string, type: MessageType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToaster = (message: string, type: MessageType) => {
    setToasts([...toasts, { message, type }]);
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.slice(1));
    }, 10 * 1000);
  };

  return (
    <ToastContext.Provider value={{ toasts, showToaster }}>
      {children}
    </ToastContext.Provider>
  );
};

export const Toaster = () => {
  const { toasts } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <Toast key={index} className={`toast toast-${toast.type}`}>
          <div className="flex items-center justify-between w-full">
            <div className="toast-icon my-1">
              {toast.type === "info" && <FaInfoCircle />}
              {toast.type === "success" && <FaCheckCircle />}
              {toast.type === "error" && <FaTimesCircle />}
            </div>
            <div className="w-full mx-4">{toast.message}</div>
          </div>
          <Toast.Toggle />
        </Toast>
      ))}
    </div>
  );
};
