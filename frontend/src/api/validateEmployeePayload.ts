import { payloadFromForm } from "./employeePayload";
import type { EmployeeFieldErrors } from "./employeeFieldErrors";
import { hasEmployeeFieldErrors } from "./employeeFieldErrors";
import type { CreateEmployeePayload } from "./types";

const REQUIRED_FIELD_MESSAGES: Partial<Record<keyof CreateEmployeePayload, string>> = {
  first_name: "First name is required",
  last_name: "Last name is required",
  email: "Email is required",
  job_title: "Job title is required",
  department: "Department is required",
  employment_type: "Employment type is required",
  salary: "Salary is required",
  date_of_joining: "Date of joining is required",
};

export function validateEmployeePayload(payload: CreateEmployeePayload): EmployeeFieldErrors {
  const errors: EmployeeFieldErrors = {};

  for (const [field, message] of Object.entries(REQUIRED_FIELD_MESSAGES) as [
    keyof CreateEmployeePayload,
    string,
  ][]) {
    if (!String(payload[field]).trim()) {
      errors[field] = message;
    }
  }

  if (!errors.email && payload.email.trim() && !payload.email.includes("@")) {
    errors.email = "Enter a valid email address";
  }

  return errors;
}

export function validateEmployeeForm(form: HTMLFormElement): EmployeeFieldErrors {
  return validateEmployeePayload(payloadFromForm(form));
}

export { hasEmployeeFieldErrors };
