import { describe, expect, it } from "vitest";
import { hasEmployeeFieldErrors, validateEmployeePayload } from "./validateEmployeePayload";
import type { CreateEmployeePayload } from "./types";

const validPayload: CreateEmployeePayload = {
  first_name: "Grace",
  last_name: "Hopper",
  email: "grace.hopper@example.com",
  job_title: "Software Engineer",
  department: "Engineering",
  employment_type: "full_time",
  country: "India",
  salary: "2000000.00",
  currency: "INR",
  date_of_joining: "2021-06-01",
};

describe("validateEmployeePayload", () => {
  it("returns required-field messages for empty values", () => {
    const errors = validateEmployeePayload({
      ...validPayload,
      last_name: "",
      department: "  ",
      date_of_joining: "",
    });

    expect(errors.last_name).toBe("Last name is required");
    expect(errors.department).toBe("Department is required");
    expect(errors.date_of_joining).toBe("Date of joining is required");
    expect(hasEmployeeFieldErrors(errors)).toBe(true);
  });

  it("returns no errors for a complete payload", () => {
    expect(hasEmployeeFieldErrors(validateEmployeePayload(validPayload))).toBe(false);
  });
});
