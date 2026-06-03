import type { CountrySalaryInsight } from "../api/types";

export const TOP_CHART_COUNTRY_COUNT = 8;

function toAverageSalaryValue(salary: string): number {
  return Number(salary);
}

export function topCountriesByAverageSalary(
  insights: CountrySalaryInsight[],
): CountrySalaryInsight[] {
  return [...insights]
    .sort((a, b) => toAverageSalaryValue(b.avg_salary) - toAverageSalaryValue(a.avg_salary))
    .slice(0, TOP_CHART_COUNTRY_COUNT);
}

export function firstChartCountry(insights: CountrySalaryInsight[]): string | null {
  return topCountriesByAverageSalary(insights)[0]?.country ?? null;
}
