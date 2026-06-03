import { delay, http, HttpResponse } from "msw";
import { server } from "./server";

export function stubSlowFailingCreateEmployee(delayMs = 50): void {
  server.use(
    http.post("/api/employees/", async () => {
      await delay(delayMs);
      return HttpResponse.json({ detail: "Server error" }, { status: 500 });
    }),
  );
}
