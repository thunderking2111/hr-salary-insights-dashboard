import { describe, expect, it } from "vitest";
import { parseEmployeeFieldErrors } from "./employeeFieldErrors";

describe("parseEmployeeFieldErrors", () => {
  it("parses DRF field error arrays from a 400 response body", () => {
    const body = JSON.stringify({
      last_name: ["This field may not be blank."],
      salary: ["This field may not be blank."],
    });

    expect(parseEmployeeFieldErrors(body)).toEqual({
      last_name: "This field may not be blank.",
      salary: "This field may not be blank.",
    });
  });

  it("returns null for non-field error bodies", () => {
    expect(parseEmployeeFieldErrors("not json")).toBeNull();
    expect(parseEmployeeFieldErrors(JSON.stringify({ detail: "Forbidden" }))).toBeNull();
  });
});
