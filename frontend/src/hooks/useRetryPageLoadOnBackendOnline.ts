import { useEffect, useRef } from "react";
import { useBackendHealth } from "../context/BackendHealthProvider";

type RetryPageLoadOptions = {
  loading: boolean;
  error: string | null;
  reload: () => void;
  enabled?: boolean;
};

export function useRetryPageLoadOnBackendOnline({
  loading,
  error,
  reload,
  enabled = true,
}: RetryPageLoadOptions) {
  const { status } = useBackendHealth();
  const prevStatusRef = useRef(status);
  const loadStateRef = useRef({
    unreachableDuringLoad: false,
    pendingWhenBecameOnline: false,
    retriedAfterPendingFailure: false,
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (loading && status !== "online") {
      loadStateRef.current.unreachableDuringLoad = true;
    }
    if (loading) {
      loadStateRef.current.retriedAfterPendingFailure = false;
    }
  }, [enabled, loading, status]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = status;

    if (status !== "online" || prevStatus === "online") {
      return;
    }

    if (loading) {
      loadStateRef.current.pendingWhenBecameOnline = true;
      return;
    }

    if (error) {
      reload();
    }
  }, [enabled, status, loading, error, reload]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const state = loadStateRef.current;

    if (
      !loading &&
      error &&
      state.pendingWhenBecameOnline &&
      !state.retriedAfterPendingFailure
    ) {
      state.retriedAfterPendingFailure = true;
      state.pendingWhenBecameOnline = false;
      reload();
      return;
    }

    if (!loading && !error) {
      state.unreachableDuringLoad = false;
      state.pendingWhenBecameOnline = false;
      state.retriedAfterPendingFailure = false;
    }
  }, [enabled, loading, error, reload]);
}
