import { describe, expect, it } from "vitest";
import { ApiValidationError } from "./employeeFieldErrors";
import { createEmployee, fetchEmployees, fetchSalaryByCountry, fetchSalaryByJobTitle } from "./client";
import type { CreateEmployeePayload } from "./types";
import { stubCreateEmployeeValidationError } from "../test/stubCreateEmployeeValidationError";

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

describe("fetchEmployees", () => {
  it("returns paginated employee results", async () => {
    const data = await fetchEmployees(1);

    expect(data.count).toBe(1);
    expect(data.results[0]?.full_name).toBe("Ada Lovelace");
  });
});

describe("createEmployee", () => {
  it("throws ApiValidationError for DRF field validation responses", async () => {
    stubCreateEmployeeValidationError();

    await expect(createEmployee(validPayload)).rejects.toBeInstanceOf(ApiValidationError);
    await expect(createEmployee(validPayload)).rejects.toMatchObject({
      fieldErrors: {
        last_name: "This field may not be blank.",
        department: "This field may not be blank.",
      },
    });
  });
});

describe("fetchSalaryByCountry", () => {
  it("returns enough countries for insights view-all pagination", async () => {
    const data = await fetchSalaryByCountry();

    expect(data.length).toBeGreaterThanOrEqual(9);
    expect(Number(data[0]?.max_salary)).toBeGreaterThan(Number(data[0]?.min_salary));
  });
});

describe("fetchSalaryByJobTitle", () => {
  it("returns enough job titles for view-all dialog", async () => {
    const data = await fetchSalaryByJobTitle("India");

    expect(data.length).toBeGreaterThanOrEqual(11);
  });
});
