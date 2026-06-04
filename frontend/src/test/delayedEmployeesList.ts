import { delay, http, HttpResponse } from "msw";
import { paginatedEmployees } from "./fixtures";
import { server } from "./server";

export function stubDelayedEmployeesList(delayMs = 200): void {
  server.use(
    http.get("/api/employees/", async () => {
      await delay(delayMs);
      return HttpResponse.json(paginatedEmployees);
    }),
  );
}
