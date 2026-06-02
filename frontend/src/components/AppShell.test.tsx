import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test/render";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders Employees navigation link", () => {
    renderWithProviders(<AppShell />, { route: "/employees" });

    expect(screen.getByRole("link", { name: /employees/i })).toBeInTheDocument();
  });

  it("renders Salary Insights navigation link", () => {
    renderWithProviders(<AppShell />, { route: "/insights" });

    expect(screen.getByRole("link", { name: /salary insights/i })).toBeInTheDocument();
  });

  it("renders MVP nav links inside a complementary primary navigation landmark", () => {
    renderWithProviders(<AppShell />, { route: "/employees" });

    const sidebar = screen.getByRole("complementary", { name: /primary navigation/i });
    expect(within(sidebar).getByRole("link", { name: /employees/i })).toBeInTheDocument();
    expect(within(sidebar).getByRole("link", { name: /salary insights/i })).toBeInTheDocument();
  });
});
