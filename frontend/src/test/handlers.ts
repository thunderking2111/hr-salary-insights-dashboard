import { http, HttpResponse } from "msw";
import type { CreateEmployeePayload, Employee } from "../api/types";
import { paginatedEmployees, sampleEmployee } from "./fixtures";

let employees: Employee[] = [...paginatedEmployees.results];

export function resetEmployeeHandlers(): void {
  employees = [sampleEmployee];
}

export const handlers = [
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
];
