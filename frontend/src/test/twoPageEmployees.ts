import { delay, http, HttpResponse } from "msw";
import type { Employee } from "../api/types";
import { sampleEmployee } from "./fixtures";
import { server } from "./server";

export const pageTwoEmployee: Employee = {
  id: 2,
  first_name: "Grace",
  last_name: "Hopper",
  full_name: "Grace Hopper",
  email: "grace.hopper@example.com",
  job_title: "Software Engineer",
  department: "Engineering",
  employment_type: "full_time",
  country: "India",
  salary: "2000000.00",
  currency: "INR",
  date_of_joining: "2021-06-01",
  created_at: "2021-06-01T00:00:00Z",
  updated_at: "2021-06-01T00:00:00Z",
};

const PAGINATED_TOTAL = 51;

function buildFullFirstPage(lead: Employee): Employee[] {
  const fillers = Array.from({ length: 49 }, (_, index) => ({
    ...lead,
    id: 100 + index,
    first_name: "Filler",
    last_name: `${index + 1}`,
    full_name: `Filler ${index + 1}`,
    email: `filler${index + 1}@example.com`,
  }));
  return [lead, ...fillers];
}

export function stubDelayedPageTwoEmployees(delayMs = 200): void {
  server.use(
    http.get("/api/employees/", async ({ request }) => {
      const page = new URL(request.url).searchParams.get("page") ?? "1";
      if (page === "2") {
        await delay(delayMs);
        return HttpResponse.json({
          count: PAGINATED_TOTAL,
          next: null,
          previous: "/api/employees/?page=1",
          results: [pageTwoEmployee],
        });
      }
      return HttpResponse.json({
        count: PAGINATED_TOTAL,
        next: "/api/employees/?page=2",
        previous: null,
        results: buildFullFirstPage(sampleEmployee),
      });
    }),
  );
}

export function stubTwoPageEmployeesList(
  pageOne = sampleEmployee,
  pageTwo = pageTwoEmployee,
): void {
  server.use(
    http.get("/api/employees/", ({ request }) => {
      const page = new URL(request.url).searchParams.get("page") ?? "1";
      if (page === "2") {
        return HttpResponse.json({
          count: PAGINATED_TOTAL,
          next: null,
          previous: "/api/employees/?page=1",
          results: [pageTwo],
        });
      }
      return HttpResponse.json({
        count: PAGINATED_TOTAL,
        next: "/api/employees/?page=2",
        previous: null,
        results: buildFullFirstPage(pageOne),
      });
    }),
  );
}
