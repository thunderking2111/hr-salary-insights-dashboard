import { describe, expect, it } from "vitest";
import { fetchEmployees } from "./client";

describe("fetchEmployees", () => {
  it("returns paginated employee results", async () => {
    const data = await fetchEmployees(1);

    expect(data.count).toBe(1);
    expect(data.results[0]?.full_name).toBe("Ada Lovelace");
  });
});
