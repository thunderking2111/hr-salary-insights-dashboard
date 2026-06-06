import type { Employee } from "../api/types";

export function employeeMatchesSearch(employee: Employee, search: string): boolean {
  const term = search.trim().toLowerCase();
  if (!term) {
    return true;
  }

  const fields = [
    employee.first_name,
    employee.last_name,
    employee.full_name,
    employee.email,
  ];

  return fields.some((value) => value.toLowerCase().includes(term));
}
