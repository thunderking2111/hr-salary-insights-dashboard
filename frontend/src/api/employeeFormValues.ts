import type { CreateEmployeePayload, Employee } from "./types";

export function employeeToFormValues(employee: Employee): CreateEmployeePayload {
  return {
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    job_title: employee.job_title,
    department: employee.department,
    employment_type: employee.employment_type,
    country: employee.country,
    salary: employee.salary,
    currency: employee.currency,
    date_of_joining: employee.date_of_joining,
  };
}
