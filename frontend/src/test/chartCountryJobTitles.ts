import { delay, http, HttpResponse } from "msw";
import type { JobTitleSalaryInsight } from "../api/types";
import { elevenJobTitlesForCountry01 } from "./elevenJobTitlesForCountry01";
import { server } from "./server";

export const country02JobTitleInsights: JobTitleSalaryInsight[] = [
  { job_title: "Product Manager", avg_salary: "500000.00", employee_count: 1 },
];

export function stubDelayedJobTitlesForCountry02(delayMs = 200): void {
  server.use(
    http.get("/api/insights/salary-by-job-title/", async ({ request }) => {
      const country = new URL(request.url).searchParams.get("country");
      if (country === "Country01") {
        return HttpResponse.json(elevenJobTitlesForCountry01);
      }
      if (country === "Country02") {
        await delay(delayMs);
        return HttpResponse.json(country02JobTitleInsights);
      }
      return HttpResponse.json([]);
    }),
  );
}

export function stubChartCountryJobTitles(): void {
  server.use(
    http.get("/api/insights/salary-by-job-title/", ({ request }) => {
      const country = new URL(request.url).searchParams.get("country");
      if (country === "Country01") {
        return HttpResponse.json(elevenJobTitlesForCountry01);
      }
      if (country === "Country02") {
        return HttpResponse.json(country02JobTitleInsights);
      }
      return HttpResponse.json([]);
    }),
  );
}

export function stubFailingJobTitlesForCountry01(): void {
  server.use(
    http.get("/api/insights/salary-by-job-title/", ({ request }) => {
      const country = new URL(request.url).searchParams.get("country");
      if (country === "Country01") {
        return new HttpResponse(null, { status: 500 });
      }
      return HttpResponse.json([]);
    }),
  );
}

export function stubEmptyJobTitlesForCountry01(): void {
  server.use(
    http.get("/api/insights/salary-by-job-title/", ({ request }) => {
      const country = new URL(request.url).searchParams.get("country");
      if (country === "Country01") {
        return HttpResponse.json([]);
      }
      return HttpResponse.json([]);
    }),
  );
}
