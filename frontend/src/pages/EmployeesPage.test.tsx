import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmployeesPage } from "./EmployeesPage";

describe("EmployeesPage", () => {
  it("renders employee rows from the API", async () => {
    render(<EmployeesPage />);

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
  });

  it("renders employee profile columns from the API", async () => {
    render(<EmployeesPage />);

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("India")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("1500000.00")).toBeInTheDocument();
  });

  it("opens add employee dialog when Add Employee is clicked", async () => {
    render(<EmployeesPage />);

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));

    expect(screen.getByRole("dialog", { name: /add employee/i })).toBeInTheDocument();
  });
});
