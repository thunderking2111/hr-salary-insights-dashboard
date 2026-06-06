import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import * as client from "../api/client";
import {
  BackendHealthProvider,
  TEST_BACKEND_HEALTH_POLL_MS,
} from "../context/BackendHealthProvider";
import type { JobTitleSalaryInsight } from "../api/types";
import { country02JobTitleInsights } from "../test/chartCountryJobTitles";
import { elevenJobTitlesForCountry01 } from "../test/elevenJobTitlesForCountry01";
import { useChartCountryJobTitles } from "./useChartCountryJobTitles";

const staleCountry01 = vi.hoisted(() => {
  let resolveCountry01!: (value: JobTitleSalaryInsight[]) => void;
  let rejectCountry01!: (reason: Error) => void;
  const pending = new Promise<JobTitleSalaryInsight[]>((resolve, reject) => {
    resolveCountry01 = resolve;
    rejectCountry01 = reject;
  });

  return {
    pending,
    resolve: () => resolveCountry01(elevenJobTitlesForCountry01),
    reject: (reason: Error) => rejectCountry01(reason),
  };
});

vi.mock("../api/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/client")>();
  return {
    ...actual,
    fetchSalaryByJobTitle: vi.fn((country: string, init?: Pick<RequestInit, "signal">) => {
      if (country === "Country01") {
        init?.signal?.addEventListener("abort", () => {
          staleCountry01.reject(new DOMException("Aborted", "AbortError"));
        });
        return staleCountry01.pending;
      }
      if (country === "Country02") {
        return Promise.resolve(country02JobTitleInsights);
      }
      return Promise.resolve([]);
    }),
  };
});

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <BackendHealthProvider pollMs={TEST_BACKEND_HEALTH_POLL_MS}>{children}</BackendHealthProvider>
    );
  };
}

describe("useChartCountryJobTitles", () => {
  it("ignores stale job title responses when chart country changes quickly", async () => {
    const fetchJobTitles = vi.mocked(client.fetchSalaryByJobTitle);
    const { result } = renderHook(() => useChartCountryJobTitles(), { wrapper: createWrapper() });

    await act(async () => {
      result.current.setChartCountry("Country01");
    });
    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    const country01Signal = fetchJobTitles.mock.calls.find(([country]) => country === "Country01")?.[1]
      ?.signal;
    expect(country01Signal).toBeDefined();

    await act(async () => {
      result.current.selectChartCountry("Country02");
    });

    await waitFor(() => {
      expect(country01Signal?.aborted).toBe(true);
      expect(result.current.tableCountry).toBe("Country02");
      expect(result.current.chartJobTitles).toEqual(country02JobTitleInsights);
    });

    staleCountry01.resolve();

    await waitFor(() => {
      expect(result.current.tableCountry).toBe("Country02");
      expect(result.current.chartJobTitles).toEqual(country02JobTitleInsights);
    });
  });
});
