import { useCallback, useEffect, useState } from "react";
import { fetchEmployees } from "../api/client";
import type { Employee } from "../api/types";

/** Matches Django REST framework PAGE_SIZE in backend config. */
export const EMPLOYEE_LIST_PAGE_SIZE = 50;

export function useEmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadEmployees = useCallback((pageToLoad: number) => {
    void fetchEmployees(pageToLoad)
      .then((data) => {
        setEmployees(data.results);
        setPage(pageToLoad);
        setTotalCount(data.count);
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
    totalCount,
    loadEmployees,
    reloadCurrentPage,
  };
}
