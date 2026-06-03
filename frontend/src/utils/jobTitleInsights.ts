import type { JobTitleSalaryInsight } from "../api/types";

export const TOP_JOB_TITLE_COUNT = 10;

function toAverageSalaryValue(salary: string): number {
  return Number(salary);
}

export function topJobTitlesByAverageSalary(
  insights: JobTitleSalaryInsight[],
): JobTitleSalaryInsight[] {
  return [...insights]
    .sort((a, b) => toAverageSalaryValue(b.avg_salary) - toAverageSalaryValue(a.avg_salary))
    .slice(0, TOP_JOB_TITLE_COUNT);
}
