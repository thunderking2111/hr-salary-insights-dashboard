import { http, HttpResponse } from "msw";
import type { CountrySalaryInsight } from "../api/types";
import { server } from "./server";

/** Nine countries by descending avg salary; chart MVP shows top eight only. */
export const nineCountrySalaryInsights: CountrySalaryInsight[] = [
  { country: "Country01", min_salary: "100.00", max_salary: "100.00", avg_salary: "9000000.00" },
  { country: "Country02", min_salary: "100.00", max_salary: "100.00", avg_salary: "8000000.00" },
  { country: "Country03", min_salary: "100.00", max_salary: "100.00", avg_salary: "7000000.00" },
  { country: "Country04", min_salary: "100.00", max_salary: "100.00", avg_salary: "6000000.00" },
  { country: "Country05", min_salary: "100.00", max_salary: "100.00", avg_salary: "5000000.00" },
  { country: "Country06", min_salary: "100.00", max_salary: "100.00", avg_salary: "4000000.00" },
  { country: "Country07", min_salary: "100.00", max_salary: "100.00", avg_salary: "3000000.00" },
  { country: "Country08", min_salary: "100.00", max_salary: "100.00", avg_salary: "2000000.00" },
  { country: "Country09", min_salary: "100.00", max_salary: "100.00", avg_salary: "1000000.00" },
];

export const topEightChartCountries = nineCountrySalaryInsights
  .slice(0, 8)
  .map((row) => row.country);

export const excludedNinthChartCountry = nineCountrySalaryInsights[8]!.country;

export function stubNineCountrySalaryInsights(): void {
  server.use(
    http.get("/api/insights/salary-by-country/", () =>
      HttpResponse.json(nineCountrySalaryInsights),
    ),
  );
}
