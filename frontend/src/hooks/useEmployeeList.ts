import { useCallback, useEffect, useState } from "react";
import { fetchEmployees } from "../api/client";
import type { Employee } from "../api/types";
import { useRetryPageLoadOnBackendOnline } from "./useRetryPageLoadOnBackendOnline";

/** Matches Django REST framework PAGE_SIZE in backend config. */
export const EMPLOYEE_LIST_PAGE_SIZE = 50;

/** Delay before search input triggers a refetch. */
export const EMPLOYEE_SEARCH_DEBOUNCE_MS = 300;

export function useEmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, EMPLOYEE_SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(handle);
    };
  }, [search]);

  const loadEmployees = useCallback((pageToLoad: number, searchTerm = debouncedSearch) => {
    setLoading(true);
    setError(null);

    void fetchEmployees(pageToLoad, searchTerm)
      .then((data) => {
        setEmployees(data.results);
        setPage(pageToLoad);
        setTotalCount(data.count);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load employees");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedSearch]);

  useEffect(() => {
    loadEmployees(1);
  }, [loadEmployees]);

  const reloadCurrentPage = useCallback(() => {
    loadEmployees(page);
  }, [loadEmployees, page]);

  useRetryPageLoadOnBackendOnline({
    loading,
    error,
    reload: reloadCurrentPage,
  });

  return {
    employees,
    error,
    setError,
    loading,
    page,
    totalCount,
    search,
    setSearch,
    debouncedSearch,
    loadEmployees,
    reloadCurrentPage,
  };
}
