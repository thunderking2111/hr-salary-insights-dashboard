import { describe, expect, it } from "vitest";
import { isAbortError } from "./isAbortError";

describe("isAbortError", () => {
  it("returns true for AbortError DOMException", () => {
    expect(isAbortError(new DOMException("Aborted", "AbortError"))).toBe(true);
  });

  it("returns false for other errors", () => {
    expect(isAbortError(new Error("Failed"))).toBe(false);
  });
});
