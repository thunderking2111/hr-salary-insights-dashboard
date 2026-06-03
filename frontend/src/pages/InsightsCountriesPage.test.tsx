import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { stubChartCountryJobTitles } from "../test/chartCountryJobTitles";
import { excludedEleventhJobTitleForCountry01 } from "../test/elevenJobTitlesForCountry01";
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

  it("opens MUI dialog with full job titles when a country row is clicked", async () => {
    stubNineCountrySalaryInsights();
    stubChartCountryJobTitles();
    renderInsightsCountriesPage();

    const table = await screen.findByRole("table", { name: /salary by country/i });
    fireEvent.click(within(table).getByRole("cell", { name: "Country01" }));

    const dialog = await screen.findByRole("dialog", { name: /job titles in country01/i });
    expect(dialog.className).toMatch(/MuiDialog-paper/);
    expect(
      within(dialog).getByRole("cell", { name: excludedEleventhJobTitleForCountry01 }),
    ).toBeInTheDocument();
  });
});
