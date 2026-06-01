import { fireEvent, render, screen, within } from "@testing-library/react";
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

  it("shows job title salaries when a country is selected", async () => {
    render(<InsightsPage />);

    await screen.findByText("India");
    fireEvent.click(screen.getByRole("button", { name: /view job titles for india/i }));

    const dialog = await screen.findByRole("dialog", { name: /job titles in india/i });
    expect(await within(dialog).findByText("Software Engineer")).toBeInTheDocument();
    expect(within(dialog).getByText("2000000.00")).toBeInTheDocument();
  });

  it("renders average salary chart by country from the API", async () => {
    render(<InsightsPage />);

    expect(
      await screen.findByRole("figure", { name: /average salary by country/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("listitem", { name: /india, average salary 2000000.00/i }),
    ).toBeInTheDocument();
  });
});
