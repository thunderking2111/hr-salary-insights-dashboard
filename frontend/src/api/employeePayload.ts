import type { CreateEmployeePayload } from "./types";

export function payloadFromForm(form: HTMLFormElement): CreateEmployeePayload {
  const data = new FormData(form);
  return {
    first_name: String(data.get("first_name")),
    last_name: String(data.get("last_name")),
    email: String(data.get("email")),
    job_title: String(data.get("job_title")),
    department: String(data.get("department")),
    employment_type: String(data.get("employment_type")),
    country: String(data.get("country")),
    salary: String(data.get("salary")),
    currency: String(data.get("currency")),
    date_of_joining: String(data.get("date_of_joining")),
  };
}
