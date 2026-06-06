import { http, HttpResponse } from "msw";
import type { Employee } from "../api/types";
import { sampleEmployee } from "./fixtures";
import { pageTwoEmployee } from "./twoPageEmployees";
import { employeeMatchesSearch } from "./employeeSearch";
import { server } from "./server";

const searchableEmployees: Employee[] = [sampleEmployee, pageTwoEmployee];

export function stubSearchableEmployeesList(): void {
  server.use(
    http.get("/api/employees/", ({ request }) => {
      const url = new URL(request.url);
      const search = url.searchParams.get("search") ?? "";
      const filtered = searchableEmployees.filter((employee) =>
        employeeMatchesSearch(employee, search),
      );

      return HttpResponse.json({
        count: filtered.length,
        next: null,
        previous: null,
        results: filtered,
      });
    }),
  );
}
