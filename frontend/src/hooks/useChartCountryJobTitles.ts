import { useCallback, useEffect, useState } from "react";
import { fetchSalaryByJobTitle } from "../api/client";
import type { JobTitleSalaryInsight } from "../api/types";
import { isAbortError } from "../utils/isAbortError";
import { useRetryPageLoadOnBackendOnline } from "./useRetryPageLoadOnBackendOnline";

export function useChartCountryJobTitles() {
  const [chartCountry, setChartCountry] = useState<string | null>(null);
  const [tableCountry, setTableCountry] = useState<string | null>(null);
  const [chartJobTitles, setChartJobTitles] = useState<JobTitleSalaryInsight[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const selectChartCountry = useCallback((country: string) => {
    setChartCountry((current) => (current === country ? current : country));
  }, []);

  const openJobTitlesDialog = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const closeJobTitlesDialog = useCallback(() => {
    setDialogOpen(false);
    setError(null);
  }, []);

  const reloadJobTitles = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    if (!chartCountry) {
      setTableCountry(null);
      setChartJobTitles([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    setDialogOpen(false);
    setLoading(true);
    setError(null);

    void fetchSalaryByJobTitle(chartCountry, { signal: controller.signal })
      .then((data) => {
        setChartJobTitles(data);
        setTableCountry(chartCountry);
      })
      .catch((err: unknown) => {
        if (isAbortError(err)) {
          return;
        }
        setError("Failed to load job titles");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [chartCountry, reloadToken]);

  useRetryPageLoadOnBackendOnline({
    loading,
    error,
    reload: reloadJobTitles,
    enabled: chartCountry !== null,
  });

  return {
    chartCountry,
    setChartCountry,
    tableCountry,
    chartJobTitles,
    dialogOpen,
    loading,
    error,
    selectChartCountry,
    openJobTitlesDialog,
    closeJobTitlesDialog,
  };
}
