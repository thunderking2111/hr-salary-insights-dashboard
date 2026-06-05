import { useEffect, useRef, useState } from "react";
import { fetchHealth } from "../api/client";

export type BackendHealthStatus = "checking" | "online" | "offline";

const POLL_MS: Record<BackendHealthStatus, number> = {
  checking: 3000,
  online: 60_000,
  offline: 10000,
};

const STATUS_LABELS: Record<BackendHealthStatus, string> = {
  checking: "Starting server…",
  online: "API online",
  offline: "API unavailable",
};

export function useBackendHealth() {
  const [status, setStatus] = useState<BackendHealthStatus>("checking");
  const statusRef = useRef(status);
  statusRef.current = status;

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
      }, POLL_MS[nextStatus]);
    };

    void check();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return { status, label: STATUS_LABELS[status] };
}
