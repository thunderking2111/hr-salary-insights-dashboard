import { ApiValidationError, parseEmployeeFieldErrors } from "./employeeFieldErrors";
import type {
  CountrySalaryInsight,
  CreateEmployeePayload,
  Employee,
  JobTitleSalaryInsight,
  PaginatedEmployees,
} from "./types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    if (response.status === 400) {
      const fieldErrors = parseEmployeeFieldErrors(message);
      if (fieldErrors) {
        throw new ApiValidationError(fieldErrors);
      }
    }
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function requestNoContent(path: string, init?: RequestInit): Promise<void> {
  const response = await fetch(`${API_BASE}${path}`, init);

  if (!response.ok) {
    const message = await response.text();
    if (response.status === 400) {
      const fieldErrors = parseEmployeeFieldErrors(message);
      if (fieldErrors) {
        throw new ApiValidationError(fieldErrors);
      }
    }
    throw new Error(message || `Request failed: ${response.status}`);
  }
}

export async function fetchEmployees(page = 1): Promise<PaginatedEmployees> {
  return request<PaginatedEmployees>(`/api/employees/?page=${page}`);
}

export async function fetchSalaryByCountry(): Promise<CountrySalaryInsight[]> {
  return request<CountrySalaryInsight[]>("/api/insights/salary-by-country/");
}

export async function fetchSalaryByJobTitle(country: string): Promise<JobTitleSalaryInsight[]> {
  const params = new URLSearchParams({ country });
  return request<JobTitleSalaryInsight[]>(
    `/api/insights/salary-by-job-title/?${params.toString()}`,
  );
}

export async function createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
  return request<Employee>("/api/employees/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateEmployee(
  id: number,
  payload: CreateEmployeePayload,
): Promise<Employee> {
  return request<Employee>(`/api/employees/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteEmployee(id: number): Promise<void> {
  return requestNoContent(`/api/employees/${id}/`, { method: "DELETE" });
}

export type {
  CountrySalaryInsight,
  CreateEmployeePayload,
  Employee,
  JobTitleSalaryInsight,
  PaginatedEmployees,
};
