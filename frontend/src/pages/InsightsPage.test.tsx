import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InsightsPage } from "./InsightsPage";

describe("InsightsPage", () => {
  it("renders salary by country rows from the API", async () => {
    render(<InsightsPage />);

    expect(await screen.findByText("India")).toBeInTheDocument();
    expect(screen.getByText("1000000.00")).toBeInTheDocument();
    expect(screen.getByText("3000000.00")).toBeInTheDocument();
    expect(screen.getByText("2000000.00")).toBeInTheDocument();
  });
});
