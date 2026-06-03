import { delay, http, HttpResponse } from "msw";
import { server } from "./server";

export function stubSlowFailingUpdateEmployee(delayMs = 50): void {
  server.use(
    http.patch("/api/employees/:id/", async () => {
      await delay(delayMs);
      return HttpResponse.json({ detail: "Server error" }, { status: 500 });
    }),
  );
}
