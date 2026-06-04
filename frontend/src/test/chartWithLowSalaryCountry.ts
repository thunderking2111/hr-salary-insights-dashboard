import { http, HttpResponse } from "msw";
import type { CountrySalaryInsight, JobTitleSalaryInsight } from "../api/types";
import { server } from "./server";

export const lowSalaryCountryInsights: CountrySalaryInsight[] = [
  { country: "Germany", min_salary: "1000000.00", max_salary: "5000000.00", avg_salary: "3000000.00", median_salary: "3000000.00", employee_count: 1 },
  { country: "India", min_salary: "800000.00", max_salary: "4000000.00", avg_salary: "2500000.00", median_salary: "2500000.00", employee_count: 1 },
  { country: "asd", min_salary: "123.00", max_salary: "123.00", avg_salary: "123.00", median_salary: "123.00", employee_count: 1 },
];

export const germanyJobTitleInsights: JobTitleSalaryInsight[] = [
  {
    job_title: "Engineer",
    avg_salary: "3000000.00",
    median_salary: "2500000.00",
    employee_count: 10,
  },
];

export const asdJobTitleInsights: JobTitleSalaryInsight[] = [
  { job_title: "Intern", avg_salary: "123.00", median_salary: "123.00", employee_count: 1 },
];

export function stubChartWithLowSalaryCountry(): void {
  server.use(
    http.get("/api/insights/salary-by-country/", () =>
      HttpResponse.json(lowSalaryCountryInsights),
    ),
    http.get("/api/insights/salary-by-job-title/", ({ request }) => {
      const country = new URL(request.url).searchParams.get("country");
      if (country === "Germany") {
        return HttpResponse.json(germanyJobTitleInsights);
      }
      if (country === "asd") {
        return HttpResponse.json(asdJobTitleInsights);
      }
      return HttpResponse.json([]);
    }),
  );
}
