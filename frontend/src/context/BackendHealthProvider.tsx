import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { fetchHealth } from "../api/client";

export type BackendHealthStatus = "checking" | "online" | "offline";

const DEFAULT_POLL_MS: Record<BackendHealthStatus, number> = {
  checking: 3000,
  online: 60_000,
  offline: 10_000,
};

export const TEST_BACKEND_HEALTH_POLL_MS: Record<BackendHealthStatus, number> = {
  checking: 50,
  online: 60_000,
  offline: 50,
};

const STATUS_LABELS: Record<BackendHealthStatus, string> = {
  checking: "Starting server…",
  online: "API online",
  offline: "API unavailable",
};

type BackendHealthContextValue = {
  status: BackendHealthStatus;
  label: string;
};

const BackendHealthContext = createContext<BackendHealthContextValue | null>(null);

type BackendHealthProviderProps = {
  children: ReactNode;
  pollMs?: Partial<Record<BackendHealthStatus, number>>;
};

export function BackendHealthProvider({ children, pollMs }: BackendHealthProviderProps) {
  const [status, setStatus] = useState<BackendHealthStatus>("checking");
  const statusRef = useRef(status);
  statusRef.current = status;
  const pollMsRef = useRef({ ...DEFAULT_POLL_MS, ...pollMs });
  pollMsRef.current = { ...DEFAULT_POLL_MS, ...pollMs };

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const check = async () => {
      let nextStatus: BackendHealthStatus;
      try {
        const response = await fetchHealth();
        if (cancelled) {
          return;
        }
        if (response.status === "ok") {
          nextStatus = "online";
        } else {
          nextStatus = statusRef.current === "online" ? "offline" : "checking";
        }
      } catch {
        if (cancelled) {
          return;
        }
        nextStatus = statusRef.current === "online" ? "offline" : "checking";
      }

      setStatus(nextStatus);
      statusRef.current = nextStatus;
      timeoutId = setTimeout(() => {
        void check();
      }, pollMsRef.current[nextStatus]);
    };

    void check();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <BackendHealthContext.Provider value={{ status, label: STATUS_LABELS[status] }}>
      {children}
    </BackendHealthContext.Provider>
  );
}

export function useBackendHealth(): BackendHealthContextValue {
  const context = useContext(BackendHealthContext);
  if (!context) {
    throw new Error("useBackendHealth must be used within BackendHealthProvider");
  }
  return context;
}
