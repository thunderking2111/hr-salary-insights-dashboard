import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  excludedNinthChartCountry,
  nineCountrySalaryInsights,
  stubNineCountrySalaryInsights,
  topEightChartCountries,
} from "../test/nineCountryInsights";
import { renderInsightsCountriesPage } from "../test/render";

describe("InsightsCountriesPage", () => {
  it("renders client-paginated salary by country table", async () => {
    stubNineCountrySalaryInsights();
    renderInsightsCountriesPage();

    const table = await screen.findByRole("table", { name: /salary by country/i });
    expect(table.className).toMatch(/MuiTable-root/);

    for (const country of topEightChartCountries) {
      expect(within(table).getByRole("cell", { name: country })).toBeInTheDocument();
    }
    expect(within(table).queryByRole("cell", { name: excludedNinthChartCountry })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /go to next page/i }));

    expect(
      await within(table).findByRole("cell", { name: excludedNinthChartCountry }),
    ).toBeInTheDocument();
    expect(within(table).queryByRole("cell", { name: nineCountrySalaryInsights[0]!.country })).not.toBeInTheDocument();
  });
});
