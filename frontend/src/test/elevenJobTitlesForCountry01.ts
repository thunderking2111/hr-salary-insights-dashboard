import { delay, http, HttpResponse } from "msw";
import type { JobTitleSalaryInsight } from "../api/types";
import { server } from "./server";

/** Ten jobs by descending avg salary; below-chart table shows the full set. */
export const tenJobTitlesForCountry01: JobTitleSalaryInsight[] = Array.from(
  { length: 10 },
  (_, index) => ({
    job_title: `Job${String(index + 1).padStart(2, "0")}`,
    avg_salary: String((10 - index) * 100_000),
  }),
);

/** Eleven jobs by descending avg salary; below-chart table shows top ten only. */
export const elevenJobTitlesForCountry01: JobTitleSalaryInsight[] = Array.from(
  { length: 11 },
  (_, index) => ({
    job_title: `Job${String(index + 1).padStart(2, "0")}`,
    avg_salary: String((11 - index) * 100_000),
  }),
);

export const topTenJobTitlesForCountry01 = elevenJobTitlesForCountry01
  .slice(0, 10)
  .map((row) => row.job_title);

export const excludedEleventhJobTitleForCountry01 =
  elevenJobTitlesForCountry01[10]!.job_title;

export function stubTenJobTitlesForCountry01(): void {
  server.use(
    http.get("/api/insights/salary-by-job-title/", ({ request }) => {
      const country = new URL(request.url).searchParams.get("country");
      if (country === "Country01") {
        return HttpResponse.json(tenJobTitlesForCountry01);
      }
      return HttpResponse.json([]);
    }),
  );
}

export function stubElevenJobTitlesForCountry01(): void {
  server.use(
    http.get("/api/insights/salary-by-job-title/", ({ request }) => {
      const country = new URL(request.url).searchParams.get("country");
      if (country === "Country01") {
        return HttpResponse.json(elevenJobTitlesForCountry01);
      }
      return HttpResponse.json([]);
    }),
  );
}

export function stubDelayedElevenJobTitlesForCountry01(delayMs = 200): void {
  server.use(
    http.get("/api/insights/salary-by-job-title/", async ({ request }) => {
      const country = new URL(request.url).searchParams.get("country");
      if (country === "Country01") {
        await delay(delayMs);
        return HttpResponse.json(elevenJobTitlesForCountry01);
      }
      return HttpResponse.json([]);
    }),
  );
}
