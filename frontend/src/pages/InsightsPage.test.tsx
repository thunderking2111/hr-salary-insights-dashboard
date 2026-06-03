import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  country02JobTitleInsights,
  stubChartCountryJobTitles,
} from "../test/chartCountryJobTitles";
import {
  excludedEleventhJobTitleForCountry01,
  stubElevenJobTitlesForCountry01,
  stubTenJobTitlesForCountry01,
  topTenJobTitlesForCountry01,
} from "../test/elevenJobTitlesForCountry01";
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

  it("renders top-10 job titles below chart for first chart country on load", async () => {
    stubNineCountrySalaryInsights();
    stubElevenJobTitlesForCountry01();
    renderInsightsPage();

    await screen.findByRole("figure", { name: /average salary by country/i });

    const table = await screen.findByRole("table", {
      name: /salary by job in country01/i,
    });
    expect(table.className).toMatch(/MuiTable-root/);

    for (const jobTitle of topTenJobTitlesForCountry01) {
      expect(within(table).getByRole("cell", { name: jobTitle })).toBeInTheDocument();
    }
    expect(within(table).queryByText(excludedEleventhJobTitleForCountry01)).not.toBeInTheDocument();
  });

  it("updates below-chart job table when a chart bar is clicked", async () => {
    stubNineCountrySalaryInsights();
    stubChartCountryJobTitles();
    renderInsightsPage();

    const figure = await screen.findByRole("figure", { name: /average salary by country/i });
    await screen.findByRole("table", { name: /salary by job in country01/i });

    const country02Bar = await waitFor(() => {
      const bar = figure.querySelector('[data-country="Country02"]');
      if (!bar) {
        throw new Error("Country02 chart bar not ready");
      }
      return bar;
    });
    fireEvent.click(country02Bar);

    const table = await screen.findByRole("table", {
      name: /salary by job in country02/i,
    });
    expect(
      await within(table).findByRole("cell", {
        name: country02JobTitleInsights[0]!.job_title,
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table", { name: /salary by job in country01/i })).not.toBeInTheDocument();
  });

  it("hides View all job titles when chart country has at most ten jobs", async () => {
    stubNineCountrySalaryInsights();
    stubTenJobTitlesForCountry01();
    renderInsightsPage();

    await screen.findByRole("table", { name: /salary by job in country01/i });

    expect(screen.queryByRole("button", { name: /view all job titles/i })).not.toBeInTheDocument();
  });

  it("opens MUI dialog with full job title list when View all job titles is clicked", async () => {
    stubNineCountrySalaryInsights();
    stubElevenJobTitlesForCountry01();
    renderInsightsPage();

    await screen.findByRole("table", { name: /salary by job in country01/i });

    fireEvent.click(screen.getByRole("button", { name: /view all job titles/i }));

    const dialog = await screen.findByRole("dialog", { name: /job titles in country01/i });
    expect(dialog.className).toMatch(/MuiDialog-paper/);
    expect(within(dialog).getByRole("cell", { name: "Job01" })).toBeInTheDocument();
    expect(
      within(dialog).getByRole("cell", { name: excludedEleventhJobTitleForCountry01 }),
    ).toBeInTheDocument();
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
