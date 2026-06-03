import { describe, expect, it } from "vitest";
import {
  DEFAULT_EMPLOYEE_COUNTRY,
  DEFAULT_EMPLOYEE_CURRENCY,
  applyEmployeePayloadDefaults,
} from "./employeeDefaults";
import { validateEmployeePayload } from "./validateEmployeePayload";
import type { CreateEmployeePayload } from "./types";

const validPayload: CreateEmployeePayload = {
  first_name: "Grace",
  last_name: "Hopper",
  email: "grace.hopper@example.com",
  job_title: "Software Engineer",
  department: "Engineering",
  employment_type: "full_time",
  country: "",
  salary: "2000000.00",
  currency: "  ",
  date_of_joining: "2021-06-01",
};

describe("applyEmployeePayloadDefaults", () => {
  it("fills empty country and currency with backend defaults", () => {
    expect(applyEmployeePayloadDefaults(validPayload)).toMatchObject({
      country: DEFAULT_EMPLOYEE_COUNTRY,
      currency: DEFAULT_EMPLOYEE_CURRENCY,
    });
  });
});

describe("validateEmployeePayload with optional country and currency", () => {
  it("does not require country or currency when blank", () => {
    const errors = validateEmployeePayload(validPayload);

    expect(errors.country).toBeUndefined();
    expect(errors.currency).toBeUndefined();
  });
});
