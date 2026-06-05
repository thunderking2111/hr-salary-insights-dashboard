import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { stubDelayedHealth, stubHealthOk } from "../test/stubHealth";
import { renderWithProviders } from "../test/render";
import { BackendStatusIndicator } from "./BackendStatusIndicator";

describe("BackendStatusIndicator", () => {
  it("shows Starting server while health request is pending", () => {
    stubDelayedHealth(500);
    renderWithProviders(<BackendStatusIndicator />);

    expect(screen.getByRole("status")).toHaveTextContent(/starting server/i);
  });

  it("shows API online when health returns ok", async () => {
    stubHealthOk();
    renderWithProviders(<BackendStatusIndicator />);

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/api online/i);
    });
  });
});
