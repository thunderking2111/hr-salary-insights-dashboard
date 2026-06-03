import { http, HttpResponse } from "msw";
import type { JobTitleSalaryInsight } from "../api/types";
import { elevenJobTitlesForCountry01 } from "./elevenJobTitlesForCountry01";
import { server } from "./server";

export const country02JobTitleInsights: JobTitleSalaryInsight[] = [
  { job_title: "Product Manager", avg_salary: "500000.00" },
];

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
