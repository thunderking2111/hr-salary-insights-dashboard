export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  job_title: string;
  department: string;
  employment_type: string;
  country: string;
  salary: string;
  currency: string;
  date_of_joining: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedEmployees {
  count: number;
  next: string | null;
  previous: string | null;
  results: Employee[];
}

export interface CountrySalaryInsight {
  country: string;
  min_salary: string;
  max_salary: string;
  avg_salary: string;
  median_salary: string;
  employee_count: number;
}

export interface JobTitleSalaryInsight {
  job_title: string;
  avg_salary: string;
  median_salary: string;
  employee_count: number;
}

export interface CreateEmployeePayload {
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  department: string;
  employment_type: string;
  country: string;
  salary: string;
  currency: string;
  date_of_joining: string;
}

export interface HealthResponse {
  status: "ok" | "unavailable";
  checks: {
    database: "ok" | "error";
  };
}
