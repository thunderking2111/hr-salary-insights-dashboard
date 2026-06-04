import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppThemeProvider } from "../theme/AppThemeProvider";
import { ChartJobTitlesTable } from "./ChartJobTitlesTable";
import type { JobTitleSalaryInsight } from "../api/types";

const row: JobTitleSalaryInsight = {
  job_title: "Software Engineer",
  avg_salary: "2762624.16",
  median_salary: "2958415.00",
  employee_count: 234,
};

function renderTable(jobTitles: JobTitleSalaryInsight[] = [row]) {
  return render(
    <AppThemeProvider>
      <div style={{ width: 720 }}>
        <ChartJobTitlesTable
          country="Germany"
          jobTitles={jobTitles}
          onViewAllJobTitles={vi.fn()}
        />
      </div>
    </AppThemeProvider>,
  );
}

describe("ChartJobTitlesTable", () => {
  it("renders distinct median and average salary cells", () => {
    renderTable();

    const table = screen.getByRole("table", { name: /salary by job in germany/i });
    const dataRow = within(table).getByRole("row", { name: /software engineer/i });

    expect(within(dataRow).getByRole("cell", { name: "₹29,58,415" })).toBeInTheDocument();
    expect(within(dataRow).getByRole("cell", { name: "₹27,62,624" })).toBeInTheDocument();
  });

  it("renders four data cells per job title row", () => {
    renderTable();

    const table = screen.getByRole("table", { name: /salary by job in germany/i });
    const dataRow = within(table).getAllByRole("row")[1]!;

    expect(within(dataRow).getAllByRole("cell")).toHaveLength(4);
  });
});
