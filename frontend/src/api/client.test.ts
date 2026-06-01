import { describe, expect, it } from "vitest";
import { fetchEmployees, fetchSalaryByCountry } from "./client";

describe("fetchEmployees", () => {
  it("returns paginated employee results", async () => {
    const data = await fetchEmployees(1);

    expect(data.count).toBe(1);
    expect(data.results[0]?.full_name).toBe("Ada Lovelace");
  });
});

describe("fetchSalaryByCountry", () => {
  it("returns salary stats per country", async () => {
    const data = await fetchSalaryByCountry();

    expect(data[0]?.country).toBe("India");
    expect(data[0]?.min_salary).toBe("1000000.00");
    expect(data[0]?.max_salary).toBe("3000000.00");
    expect(data[0]?.avg_salary).toBe("2000000.00");
  });
});
