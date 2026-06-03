import { useCallback, useState } from "react";

export type ToastSeverity = "success" | "error";

export interface ToastState {
  message: string;
  severity: ToastSeverity;
}

export function useSnackbarToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showSuccess = useCallback((message: string) => {
    setToast({ message, severity: "success" });
  }, []);

  const showError = useCallback((message: string) => {
    setToast({ message, severity: "error" });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showSuccess, showError, closeToast };
}
