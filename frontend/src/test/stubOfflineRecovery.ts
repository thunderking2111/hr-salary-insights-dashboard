import { delay, http, HttpResponse } from "msw";
import { paginatedEmployees } from "./fixtures";
import { server } from "./server";

const healthOkBody = { status: "ok", checks: { database: "ok" } };

export function stubHealthFailThenOk(failCount = 1): void {
  let calls = 0;
  server.use(
    http.get("/api/health/", () => {
      calls += 1;
      if (calls <= failCount) {
        return HttpResponse.error();
      }
      return HttpResponse.json(healthOkBody);
    }),
  );
}

export function stubEmployeesFailThenOk(failCount = 1): void {
  let calls = 0;
  server.use(
    http.get("/api/employees/", () => {
      calls += 1;
      if (calls <= failCount) {
        return HttpResponse.error();
      }
      return HttpResponse.json(paginatedEmployees);
    }),
  );
}

export function stubDelayedEmployeesFailThenOk(delayMs = 100, failCount = 1): void {
  let calls = 0;
  server.use(
    http.get("/api/employees/", async () => {
      await delay(delayMs);
      calls += 1;
      if (calls <= failCount) {
        return HttpResponse.error();
      }
      return HttpResponse.json(paginatedEmployees);
    }),
  );
}
