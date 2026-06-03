/** Default currency for salary display until insights API exposes per-row currency. */
const SALARY_CURRENCY = "INR";

export function formatSalaryAxisTick(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: SALARY_CURRENCY,
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatSalaryValue(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: SALARY_CURRENCY,
    maximumFractionDigits: 0,
  }).format(value);
}
