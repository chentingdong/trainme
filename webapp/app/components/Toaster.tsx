"use client";

import React, { createContext, useContext, useState, ReactNode, use } from "react";
import { Toast } from "flowbite-react";
import { FaInfoCircle, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const TOASTER_TIMEOUT = 3 * 1000;

type MessageType = "info" | "success" | "error";

interface Toast {
  type: MessageType;
  content: string;
  timeout?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (toast: Toast) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode; }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toast = (toast: Toast) => {
    setToasts([...toasts, toast]);
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.slice(1));
    }, toast.timeout || TOASTER_TIMEOUT); 
  };

  return (
    <ToastContext.Provider value={{ toasts, toast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const Toaster = () => {
  const { toasts } = useToast();

  return (
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <Toast key={index} className={`block toast toast-${toast.type}`} role="alert" aria-live="assertive" aria-atomic="true" >
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-2 capitalize">
              {toast.type === "info" && <FaInfoCircle />}
              {toast.type === "success" && <FaCheckCircle />}
              {toast.type === "error" && <FaTimesCircle />}
              <span className="font-bold">{toast.type}</span>
            </div>
            <Toast.Toggle />
          </div>
          <div className="p-4 text-sm">
            {toast.content}
          </div>
        </Toast>
      ))}
    </div>
  );
};