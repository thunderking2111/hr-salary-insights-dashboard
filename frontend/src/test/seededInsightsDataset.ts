import type { CountrySalaryInsight, JobTitleSalaryInsight } from "../api/types";

/** Mirrors backend/employees/data/countries.txt for deterministic UI fixtures. */
export const seededCountries = [
  "India",
  "United States",
  "United Kingdom",
  "Germany",
  "Canada",
  "Australia",
  "Singapore",
  "United Arab Emirates",
  "France",
  "Netherlands",
  "Japan",
  "Brazil",
  "Mexico",
  "Ireland",
  "Sweden",
  "Switzerland",
  "Spain",
  "Poland",
] as const;

/** Mirrors backend/employees/data/job_titles.txt for deterministic UI fixtures. */
export const seededJobTitles = [
  "Software Engineer",
  "Senior Software Engineer",
  "Staff Engineer",
  "Engineering Manager",
  "Director of Engineering",
  "Product Manager",
  "Senior Product Manager",
  "Data Analyst",
  "Data Scientist",
  "HR Specialist",
  "HR Business Partner",
  "Finance Analyst",
  "Sales Manager",
  "Customer Success Manager",
  "DevOps Engineer",
  "QA Engineer",
  "UX Designer",
  "Technical Program Manager",
] as const;

export const MIN_COUNTRIES_FOR_VIEW_ALL_PAGINATION = 9;
export const MIN_JOB_TITLES_FOR_VIEW_ALL_DIALOG = 11;

function salary(amount: number): string {
  return `${amount}.00`;
}

const countryInsightProfiles: Record<
  (typeof seededCountries)[number],
  { min: number; avg: number; max: number; employee_count: number }
> = {
  Switzerland: { min: 1_850_000, avg: 5_350_000, max: 9_100_000, employee_count: 198 },
  "United States": { min: 1_720_000, avg: 4_950_000, max: 8_450_000, employee_count: 1_180 },
  Singapore: { min: 1_650_000, avg: 4_720_000, max: 7_950_000, employee_count: 492 },
  "United Kingdom": { min: 1_580_000, avg: 4_480_000, max: 7_620_000, employee_count: 812 },
  Sweden: { min: 1_520_000, avg: 4_280_000, max: 7_180_000, employee_count: 196 },
  Germany: { min: 1_480_000, avg: 4_150_000, max: 7_050_000, employee_count: 708 },
  Canada: { min: 1_420_000, avg: 3_980_000, max: 6_780_000, employee_count: 598 },
  Ireland: { min: 1_390_000, avg: 3_860_000, max: 6_620_000, employee_count: 194 },
  Australia: { min: 1_350_000, avg: 3_720_000, max: 6_420_000, employee_count: 498 },
  Netherlands: { min: 1_320_000, avg: 3_640_000, max: 6_280_000, employee_count: 392 },
  "United Arab Emirates": { min: 1_250_000, avg: 3_480_000, max: 6_050_000, employee_count: 398 },
  France: { min: 1_180_000, avg: 3_280_000, max: 5_820_000, employee_count: 402 },
  Japan: { min: 1_120_000, avg: 3_050_000, max: 5_580_000, employee_count: 298 },
  Spain: { min: 820_000, avg: 2_280_000, max: 4_320_000, employee_count: 198 },
  Brazil: { min: 620_000, avg: 1_820_000, max: 3_420_000, employee_count: 296 },
  Mexico: { min: 580_000, avg: 1_680_000, max: 3_180_000, employee_count: 294 },
  India: { min: 420_000, avg: 1_520_000, max: 3_050_000, employee_count: 2_980 },
  Poland: { min: 380_000, avg: 1_280_000, max: 2_720_000, employee_count: 196 },
};

/** Eighteen countries by descending avg salary; chart shows top eight only. */
export const seededCountrySalaryInsights: CountrySalaryInsight[] = [...seededCountries]
  .map((country) => {
    const profile = countryInsightProfiles[country];
    return {
      country,
      min_salary: salary(profile.min),
      avg_salary: salary(profile.avg),
      max_salary: salary(profile.max),
      median_salary: salary(profile.avg - 120_000),
      employee_count: profile.employee_count,
    };
  })
  .sort((left, right) => Number(right.avg_salary) - Number(left.avg_salary));

export const seededTopEightChartCountries = seededCountrySalaryInsights
  .slice(0, 8)
  .map((row) => row.country);

export const seededExcludedNinthChartCountry = seededCountrySalaryInsights[8]!.country;

const indiaJobTitleProfiles: Record<
  (typeof seededJobTitles)[number],
  { avg: number; employee_count: number }
> = {
  "Director of Engineering": { avg: 2_850_000, employee_count: 118 },
  "Staff Engineer": { avg: 2_420_000, employee_count: 176 },
  "Senior Software Engineer": { avg: 2_050_000, employee_count: 412 },
  "Technical Program Manager": { avg: 1_980_000, employee_count: 142 },
  "Data Scientist": { avg: 1_920_000, employee_count: 188 },
  "Engineering Manager": { avg: 1_880_000, employee_count: 204 },
  "Senior Product Manager": { avg: 1_820_000, employee_count: 156 },
  "DevOps Engineer": { avg: 1_720_000, employee_count: 168 },
  "Software Engineer": { avg: 1_650_000, employee_count: 520 },
  "Product Manager": { avg: 1_580_000, employee_count: 184 },
  "Sales Manager": { avg: 1_520_000, employee_count: 132 },
  "UX Designer": { avg: 1_460_000, employee_count: 148 },
  "Customer Success Manager": { avg: 1_380_000, employee_count: 126 },
  "HR Business Partner": { avg: 1_320_000, employee_count: 112 },
  "Data Analyst": { avg: 1_260_000, employee_count: 198 },
  "Finance Analyst": { avg: 1_180_000, employee_count: 142 },
  "HR Specialist": { avg: 1_120_000, employee_count: 136 },
  "QA Engineer": { avg: 980_000, employee_count: 160 },
};

/** Eighteen India job titles by descending avg salary; table shows top ten only. */
export const seededIndiaJobTitleSalaryInsights: JobTitleSalaryInsight[] = [...seededJobTitles]
  .map((job_title) => {
    const profile = indiaJobTitleProfiles[job_title];
    return {
      job_title,
      avg_salary: salary(profile.avg),
      median_salary: salary(profile.avg - 80_000),
      employee_count: profile.employee_count,
    };
  })
  .sort((left, right) => Number(right.avg_salary) - Number(left.avg_salary));

export const seededExcludedEleventhIndiaJobTitle =
  seededIndiaJobTitleSalaryInsights[10]!.job_title;

export const seededFirstChartCountry = seededTopEightChartCountries[0]!;

export function seededJobTitleSalaryInsightsForCountry(country: string): JobTitleSalaryInsight[] {
  const countryProfile =
    countryInsightProfiles[country as (typeof seededCountries)[number]] ??
    countryInsightProfiles.India;
  const scale = countryProfile.avg / countryInsightProfiles.India.avg;

  return seededIndiaJobTitleSalaryInsights.map((row) => {
    const avg = Math.round(Number(row.avg_salary) * scale);
    const median = Math.round(Number(row.median_salary) * scale);
    return {
      ...row,
      avg_salary: salary(avg),
      median_salary: salary(median),
    };
  });
}
