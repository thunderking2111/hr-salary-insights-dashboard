import { http, HttpResponse } from "msw";
import type { CreateEmployeePayload, Employee } from "../api/types";
import {
  countrySalaryInsights,
  indiaJobTitleSalaryInsights,
  paginatedEmployees,
  sampleEmployee,
} from "./fixtures";

let employees: Employee[] = [...paginatedEmployees.results];

export function resetEmployeeHandlers(): void {
  employees = [sampleEmployee];
}

export const handlers = [
  http.get("/health/", () =>
    HttpResponse.json({ status: "ok", checks: { database: "ok" } }),
  ),
  http.get("/api/insights/salary-by-country/", () => HttpResponse.json(countrySalaryInsights)),
  http.get("/api/insights/salary-by-job-title/", ({ request }) => {
    const country = new URL(request.url).searchParams.get("country");
    if (country === "India") {
      return HttpResponse.json(indiaJobTitleSalaryInsights);
    }
    return HttpResponse.json([]);
  }),
  http.get("/api/employees/", () =>
    HttpResponse.json({
      count: employees.length,
      next: null,
      previous: null,
      results: [...employees],
    }),
  ),
  http.post("/api/employees/", async ({ request }) => {
    const body = (await request.json()) as CreateEmployeePayload;
    const employee: Employee = {
      id: employees.length + 1,
      ...body,
      full_name: `${body.first_name} ${body.last_name}`,
      created_at: "2021-06-01T00:00:00Z",
      updated_at: "2021-06-01T00:00:00Z",
    };
    employees.push(employee);
    return HttpResponse.json(employee, { status: 201 });
  }),
  http.patch("/api/employees/:id/", async ({ params, request }) => {
    const id = Number(params.id);
    const body = (await request.json()) as CreateEmployeePayload;
    const index = employees.findIndex((employee) => employee.id === id);
    if (index === -1) {
      return new HttpResponse(null, { status: 404 });
    }
    const updated: Employee = {
      ...employees[index]!,
      ...body,
      full_name: `${body.first_name} ${body.last_name}`,
      updated_at: "2021-06-02T00:00:00Z",
    };
    employees[index] = updated;
    return HttpResponse.json(updated);
  }),
  http.delete("/api/employees/:id/", ({ params }) => {
    const id = Number(params.id);
    employees = employees.filter((employee) => employee.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];
