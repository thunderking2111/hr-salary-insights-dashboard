import { useCallback, useEffect, useState } from "react";
import { fetchEmployees } from "../api/client";
import type { Employee } from "../api/types";

export function useEmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const loadEmployees = useCallback((pageToLoad: number) => {
    void fetchEmployees(pageToLoad)
      .then((data) => {
        setEmployees(data.results);
        setPage(pageToLoad);
        setHasNextPage(data.next !== null);
        setHasPreviousPage(data.previous !== null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load employees");
      });
  }, []);

  useEffect(() => {
    loadEmployees(1);
  }, [loadEmployees]);

  const reloadCurrentPage = useCallback(() => {
    loadEmployees(page);
  }, [loadEmployees, page]);

  return {
    employees,
    error,
    setError,
    page,
    hasNextPage,
    hasPreviousPage,
    loadEmployees,
    reloadCurrentPage,
  };
}
