import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  country02JobTitleInsights,
  stubChartCountryJobTitles,
  stubDelayedJobTitlesForCountry02,
  stubFailingJobTitlesForCountry01,
} from "../test/chartCountryJobTitles";
import { stubChartWithLowSalaryCountry } from "../test/chartWithLowSalaryCountry";
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
import { renderInsightsApp, renderInsightsPage } from "../test/render";
import {
  seededExcludedEleventhIndiaJobTitle,
  seededFirstChartCountry,
  seededTopEightChartCountries,
} from "../test/seededInsightsDataset";

describe("InsightsPage", () => {
  it("shows View all actions with default seeded insight dataset", async () => {
    renderInsightsApp("/insights");

    await screen.findByRole("figure", { name: /average salary by country/i });
    await screen.findByRole("table", {
      name: new RegExp(`salary by job in ${seededFirstChartCountry}`, "i"),
    });

    expect(screen.getByRole("button", { name: /^view all$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view all job titles/i })).toBeInTheDocument();
  });

  it("opens full job title list from default seeded dataset", async () => {
    renderInsightsPage();

    await screen.findByRole("table", {
      name: new RegExp(`salary by job in ${seededFirstChartCountry}`, "i"),
    });
    fireEvent.click(screen.getByRole("button", { name: /view all job titles/i }));

    const dialog = await screen.findByRole("dialog", {
      name: new RegExp(`job titles in ${seededFirstChartCountry}`, "i"),
    });
    expect(
      within(dialog).getByRole("cell", { name: seededExcludedEleventhIndiaJobTitle }),
    ).toBeInTheDocument();
  });

  it("does not render the legacy salary-by-country table on the chart view", async () => {
    renderInsightsPage();

    await screen.findByRole("figure", { name: /average salary by country/i });

    expect(screen.queryByRole("button", { name: /view job titles for/i })).not.toBeInTheDocument();
  });

  it("shows alert below chart when job titles fetch fails", async () => {
    stubNineCountrySalaryInsights();
    stubFailingJobTitlesForCountry01();
    renderInsightsPage();

    await screen.findByRole("figure", { name: /average salary by country/i });

    expect(await screen.findByRole("alert")).toHaveTextContent(/failed to load job titles/i);
    expect(
      screen.queryByRole("table", { name: /salary by job in country01/i }),
    ).not.toBeInTheDocument();
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

  it("renders median and average salary cells when a country is selected", async () => {
    stubChartWithLowSalaryCountry();
    renderInsightsPage();

    const figure = await screen.findByRole("figure", { name: /average salary by country/i });

    const germanyColumn = await waitFor(() => {
      const column = figure.querySelector('[data-chart-column="Germany"]');
      if (!column) {
        throw new Error("Germany chart column hit area not ready");
      }
      return column;
    });
    fireEvent.click(germanyColumn);

    const table = await screen.findByRole("table", { name: /salary by job in germany/i });
    const row = within(table).getByRole("row", { name: /engineer/i });

    expect(within(row).getByRole("cell", { name: "₹25,00,000" })).toBeInTheDocument();
    expect(within(row).getByRole("cell", { name: "₹30,00,000" })).toBeInTheDocument();
  });

  it("updates below-chart job table when a low-salary country column is clicked", async () => {
    stubChartWithLowSalaryCountry();
    renderInsightsPage();

    const figure = await screen.findByRole("figure", { name: /average salary by country/i });

    const asdColumn = await waitFor(() => {
      const column = figure.querySelector('[data-chart-column="asd"]');
      if (!column) {
        throw new Error("asd chart column hit area not ready");
      }
      return column;
    });
    fireEvent.click(asdColumn);

    const table = await screen.findByRole("table", { name: /salary by job in asd/i });
    expect(within(table).getByRole("cell", { name: "Intern" })).toBeInTheDocument();
  });

  it("shows centered loading spinner over job table while country changes", async () => {
    stubNineCountrySalaryInsights();
    stubChartCountryJobTitles();
    renderInsightsPage();

    const figure = await screen.findByRole("figure", { name: /average salary by country/i });
    await screen.findByRole("table", { name: /salary by job in country01/i });

    stubDelayedJobTitlesForCountry02();
    const country02Bar = await waitFor(() => {
      const bar = figure.querySelector('[data-country="Country02"]');
      if (!bar) {
        throw new Error("Country02 chart bar not ready");
      }
      return bar;
    });
    fireEvent.click(country02Bar);

    const spinner = screen.getByRole("progressbar", { name: /loading job titles/i });
    expect(spinner).toBeInTheDocument();
    expect(screen.getByRole("table", { name: /salary by job in country01/i })).toBeInTheDocument();

    const table = await screen.findByRole("table", { name: /salary by job in country02/i });
    expect(
      within(table).getByRole("cell", { name: country02JobTitleInsights[0]!.job_title }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("progressbar", { name: /loading job titles/i })).not.toBeInTheDocument();
    });
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

  it("navigates to paginated countries list when chart View all is clicked", async () => {
    stubNineCountrySalaryInsights();
    stubTenJobTitlesForCountry01();
    renderInsightsApp("/insights");

    await screen.findByRole("figure", { name: /average salary by country/i });
    await screen.findByRole("table", { name: /salary by job in country01/i });

    fireEvent.click(screen.getByRole("button", { name: /^view all$/i }));

    expect(await screen.findByRole("heading", { name: /salary by country/i })).toBeInTheDocument();

    const table = await screen.findByRole("table", { name: /salary by country/i });
    expect(table.className).toMatch(/MuiTable-root/);

    for (const country of topEightChartCountries) {
      expect(within(table).getByRole("cell", { name: country })).toBeInTheDocument();
    }
    expect(
      within(table).queryByRole("cell", { name: excludedNinthChartCountry }),
    ).not.toBeInTheDocument();

    expect(screen.queryByRole("figure", { name: /average salary by country/i })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("table", { name: /salary by job in country01/i }),
    ).not.toBeInTheDocument();
  });

  it("navigates to paginated countries list from default seeded dataset", async () => {
    renderInsightsApp("/insights");

    await screen.findByRole("figure", { name: /average salary by country/i });
    fireEvent.click(screen.getByRole("button", { name: /^view all$/i }));

    const table = await screen.findByRole("table", { name: /salary by country/i });
    for (const country of seededTopEightChartCountries) {
      expect(within(table).getByRole("cell", { name: country })).toBeInTheDocument();
    }

    fireEvent.click(screen.getByRole("button", { name: /go to next page/i }));
    expect(await within(table).findByRole("cell", { name: "Australia" })).toBeInTheDocument();
  });
});
