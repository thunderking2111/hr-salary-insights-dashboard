import { describe, expect, it } from "vitest";
import { formatSalaryAxisTick, formatSalaryValue } from "./formatSalary";

describe("formatSalary", () => {
  it("formats axis ticks with INR currency in compact notation", () => {
    expect(formatSalaryAxisTick(2_000_000)).toMatch(/₹/);
    expect(formatSalaryAxisTick(2_000_000)).not.toMatch(/^0+$/);
  });

  it("formats full salary values with INR grouping", () => {
    expect(formatSalaryValue(2_000_000)).toBe("₹20,00,000");
  });
});
