import { describe, expect, it } from "vitest";
import { appTheme } from "./theme";

describe("appTheme", () => {
  it("uses design-system primary color", () => {
    expect(appTheme.palette.primary.main).toBe("#4A56E2");
  });
});
