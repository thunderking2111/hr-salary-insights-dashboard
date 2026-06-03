import type { CreateEmployeePayload } from "./types";

export type EmployeeFieldErrors = Partial<Record<keyof CreateEmployeePayload, string>>;

const EMPLOYEE_FIELD_KEYS: (keyof CreateEmployeePayload)[] = [
  "first_name",
  "last_name",
  "email",
  "job_title",
  "department",
  "employment_type",
  "country",
  "salary",
  "currency",
  "date_of_joining",
];

export class ApiValidationError extends Error {
  readonly fieldErrors: EmployeeFieldErrors;

  constructor(fieldErrors: EmployeeFieldErrors) {
    super("Validation failed");
    this.name = "ApiValidationError";
    this.fieldErrors = fieldErrors;
  }
}

export function parseEmployeeFieldErrors(body: string): EmployeeFieldErrors | null {
  try {
    const parsed: unknown = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    const record = parsed as Record<string, unknown>;
    const fieldErrors: EmployeeFieldErrors = {};

    for (const key of EMPLOYEE_FIELD_KEYS) {
      const value = record[key];
      if (Array.isArray(value) && typeof value[0] === "string") {
        fieldErrors[key] = value[0];
      } else if (typeof value === "string") {
        fieldErrors[key] = value;
      }
    }

    return Object.keys(fieldErrors).length > 0 ? fieldErrors : null;
  } catch {
    return null;
  }
}

export function hasEmployeeFieldErrors(errors: EmployeeFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
