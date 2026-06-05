import { delay, http, HttpResponse } from "msw";
import { server } from "./server";

const healthOkBody = { status: "ok", checks: { database: "ok" } };

export function stubHealthOk(): void {
  server.use(http.get("/api/health/", () => HttpResponse.json(healthOkBody)));
}

export function stubDelayedHealth(delayMs = 500): void {
  server.use(
    http.get("/api/health/", async () => {
      await delay(delayMs);
      return HttpResponse.json(healthOkBody);
    }),
  );
}
