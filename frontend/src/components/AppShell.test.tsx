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

  it("renders HR Pulse branding in the sidebar", () => {
    renderWithProviders(<AppShell />, { route: "/employees" });

    expect(screen.getByText("HR Pulse")).toBeInTheDocument();
  });

  it("marks the active nav link with aria-current page", () => {
    renderWithProviders(<AppShell />, { route: "/employees" });

    expect(screen.getByRole("link", { name: /employees/i })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /salary insights/i })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("keeps Salary Insights active on nested insights routes", () => {
    renderWithProviders(<AppShell />, { route: "/insights/countries" });

    expect(screen.getByRole("link", { name: /salary insights/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("renders backend status indicator in the sidebar", () => {
    renderWithProviders(<AppShell />, { route: "/employees" });

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
