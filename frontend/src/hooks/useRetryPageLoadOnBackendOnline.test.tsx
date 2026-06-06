import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { describe, expect, it } from "vitest";
import {
  BackendHealthProvider,
  TEST_BACKEND_HEALTH_POLL_MS,
} from "../context/BackendHealthProvider";
import { stubDelayedEmployeesFailThenOk, stubHealthFailThenOk } from "../test/stubOfflineRecovery";
import { useRetryPageLoadOnBackendOnline } from "./useRetryPageLoadOnBackendOnline";

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <BackendHealthProvider pollMs={TEST_BACKEND_HEALTH_POLL_MS}>{children}</BackendHealthProvider>
    );
  };
}

function useLoadWithRetry() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string | null>(null);
  const [loadCount, setLoadCount] = useState(0);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setLoadCount((count) => count + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const response = await fetch("/api/employees/");
        if (!response.ok) {
          throw new Error("Request failed");
        }
        const body = (await response.json()) as { results: Array<{ first_name: string }> };
        if (cancelled) {
          return;
        }
        setData(body.results[0]?.first_name ?? null);
      } catch (err: unknown) {
        if (cancelled) {
          return;
        }
        setError(err instanceof Error ? err.message : "Request failed");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loadCount]);

  useRetryPageLoadOnBackendOnline({ loading, error, reload });

  return { loading, error, data, loadCount };
}

describe("useRetryPageLoadOnBackendOnline", () => {
  it("reloads the page request when the backend comes online after a failure", async () => {
    stubHealthFailThenOk(1);
    stubDelayedEmployeesFailThenOk(0, 1);

    const { result } = renderHook(() => useLoadWithRetry(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    await waitFor(
      () => {
        expect(result.current.data).toBe("Ada");
        expect(result.current.error).toBeNull();
      },
      { timeout: 3000 },
    );
    expect(result.current.loadCount).toBe(1);
  });

  it("retries once when a pending request fails after the backend comes online", async () => {
    stubHealthFailThenOk(1);
    stubDelayedEmployeesFailThenOk(150, 1);

    const { result } = renderHook(() => useLoadWithRetry(), { wrapper: createWrapper() });

    await waitFor(
      () => {
        expect(result.current.data).toBe("Ada");
        expect(result.current.error).toBeNull();
      },
      { timeout: 3000 },
    );
    expect(result.current.loadCount).toBe(1);
  });
});
