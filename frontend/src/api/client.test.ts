import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { ApiValidationError } from "./employeeFieldErrors";
import { createEmployee, fetchEmployees, fetchSalaryByCountry, fetchSalaryByJobTitle } from "./client";
import type { CreateEmployeePayload } from "./types";
import { paginatedEmployees } from "../test/fixtures";
import { server } from "../test/server";
import { stubCreateEmployeeValidationError } from "../test/stubCreateEmployeeValidationError";
import {
  MIN_COUNTRIES_FOR_VIEW_ALL_PAGINATION,
  MIN_JOB_TITLES_FOR_VIEW_ALL_DIALOG,
  seededCountrySalaryInsights,
  seededIndiaJobTitleSalaryInsights,
} from "../test/seededInsightsDataset";

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

  it("passes search query to the employees endpoint", async () => {
    const requestedUrls: string[] = [];
    server.use(
      http.get("/api/employees/", ({ request }) => {
        requestedUrls.push(request.url);
        return HttpResponse.json(paginatedEmployees);
      }),
    );

    await fetchEmployees(1, "Ada");

    expect(requestedUrls).toHaveLength(1);
    expect(requestedUrls[0]).toContain("search=Ada");
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
  it("returns salary stats per country", async () => {
    const data = await fetchSalaryByCountry();
    const topCountry = seededCountrySalaryInsights[0]!;

    expect(data.length).toBeGreaterThanOrEqual(MIN_COUNTRIES_FOR_VIEW_ALL_PAGINATION);
    expect(data[0]?.country).toBe(topCountry.country);
    expect(data[0]?.min_salary).toBe(topCountry.min_salary);
    expect(data[0]?.max_salary).toBe(topCountry.max_salary);
    expect(data[0]?.avg_salary).toBe(topCountry.avg_salary);
    expect(data[0]?.median_salary).toBe(topCountry.median_salary);
    expect(data[0]?.employee_count).toBe(topCountry.employee_count);
    expect(Number(data[0]?.max_salary)).toBeGreaterThan(Number(data[0]?.min_salary));
  });
});

describe("fetchSalaryByJobTitle", () => {
  it("returns salary stats per job title for a country", async () => {
    const data = await fetchSalaryByJobTitle("India");
    const topJobTitle = seededIndiaJobTitleSalaryInsights[0]!;

    expect(data.length).toBeGreaterThanOrEqual(MIN_JOB_TITLES_FOR_VIEW_ALL_DIALOG);
    expect(data[0]?.job_title).toBe(topJobTitle.job_title);
    expect(data[0]?.avg_salary).toBe(topJobTitle.avg_salary);
    expect(data[0]?.median_salary).toBe(topJobTitle.median_salary);
    expect(data[0]?.employee_count).toBe(topJobTitle.employee_count);
  });
});
