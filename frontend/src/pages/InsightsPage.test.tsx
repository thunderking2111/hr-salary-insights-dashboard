import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  excludedNinthChartCountry,
  stubNineCountrySalaryInsights,
  topEightChartCountries,
} from "../test/nineCountryInsights";
import { renderInsightsPage } from "../test/render";

describe("InsightsPage", () => {
  it("renders salary by country rows from the API", async () => {
    renderInsightsPage();

    const table = await screen.findByRole("table", { name: /salary by country/i });
    expect(within(table).getByRole("cell", { name: "India" })).toBeInTheDocument();
    expect(within(table).getByText("1000000.00")).toBeInTheDocument();
    expect(within(table).getByText("3000000.00")).toBeInTheDocument();
    expect(within(table).getByText("2000000.00")).toBeInTheDocument();
  });

  it("shows job title salaries when a country is selected", async () => {
    renderInsightsPage();

    fireEvent.click(await screen.findByRole("button", { name: /view job titles for india/i }));

    const dialog = await screen.findByRole("dialog", { name: /job titles in india/i });
    expect(await within(dialog).findByText("Software Engineer")).toBeInTheDocument();
    expect(within(dialog).getByText("2000000.00")).toBeInTheDocument();
  });

  it("renders top-8 grouped bar chart for average salary by country", async () => {
    stubNineCountrySalaryInsights();
    renderInsightsPage();

    const figure = await screen.findByRole("figure", { name: /average salary by country/i });
    expect(figure.querySelector(".recharts-wrapper")).toBeInTheDocument();

    for (const country of topEightChartCountries) {
      expect(within(figure).getByText(country)).toBeInTheDocument();
    }
    expect(within(figure).queryByText(excludedNinthChartCountry)).not.toBeInTheDocument();
  });
});
