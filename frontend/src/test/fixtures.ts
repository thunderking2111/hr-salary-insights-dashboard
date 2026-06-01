import type {
  CountrySalaryInsight,
  Employee,
  JobTitleSalaryInsight,
  PaginatedEmployees,
} from "../api/types";

export const sampleEmployee: Employee = {
  id: 1,
  first_name: "Ada",
  last_name: "Lovelace",
  full_name: "Ada Lovelace",
  email: "ada.lovelace@example.com",
  job_title: "Software Engineer",
  department: "Engineering",
  employment_type: "full_time",
  country: "India",
  salary: "1500000.00",
  currency: "INR",
  date_of_joining: "2020-01-15",
  created_at: "2020-01-15T00:00:00Z",
  updated_at: "2020-01-15T00:00:00Z",
};

export const paginatedEmployees: PaginatedEmployees = {
  count: 1,
  next: null,
  previous: null,
  results: [sampleEmployee],
};

export const countrySalaryInsights: CountrySalaryInsight[] = [
  {
    country: "India",
    min_salary: "1000000.00",
    max_salary: "3000000.00",
    avg_salary: "2000000.00",
  },
];

export const indiaJobTitleSalaryInsights: JobTitleSalaryInsight[] = [
  { job_title: "Software Engineer", avg_salary: "2000000.00" },
];
