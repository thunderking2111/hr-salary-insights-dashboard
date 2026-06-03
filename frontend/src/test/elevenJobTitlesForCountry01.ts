import { http, HttpResponse } from "msw";
import type { JobTitleSalaryInsight } from "../api/types";
import { server } from "./server";

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
