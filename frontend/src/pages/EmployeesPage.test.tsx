import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmployeesPage } from "./EmployeesPage";
import { renderWithProviders } from "../test/render";
import { stubTwoPageEmployeesList } from "../test/twoPageEmployees";

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

  it("renders employee directory in a MUI table with accessible name", async () => {
    renderWithProviders(<EmployeesPage />);

    await screen.findByText("Ada Lovelace");
    const table = screen.getByRole("table", { name: /employees/i });
    expect(table.className).toMatch(/MuiTable-root/);
  });

  it("renders Add Employee as a contained primary MUI button", async () => {
    renderWithProviders(<EmployeesPage />);

    await screen.findByText("Ada Lovelace");
    const addButton = screen.getByRole("button", { name: /add employee/i });
    expect(addButton.className).toMatch(/MuiButton-contained/);
    expect(addButton.className).toMatch(/MuiButton-colorPrimary/);
  });

  it("opens add employee dialog when Add Employee is clicked", async () => {
    render(<EmployeesPage />);

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));

    expect(screen.getByRole("dialog", { name: /add employee/i })).toBeInTheDocument();
  });

  it("opens add employee dialog as MUI Dialog", async () => {
    renderWithProviders(<EmployeesPage />);

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));

    const dialog = screen.getByRole("dialog", { name: /add employee/i });
    expect(dialog.className).toMatch(/MuiDialog-paper/);
  });

  it("adds an employee and refreshes the list", async () => {
    render(<EmployeesPage />);

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /add employee/i }));

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "Grace" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Hopper" } });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "grace.hopper@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/job title/i), {
      target: { value: "Software Engineer" },
    });
    fireEvent.change(screen.getByLabelText(/department/i), { target: { value: "Engineering" } });
    fireEvent.change(screen.getByLabelText(/employment type/i), { target: { value: "full_time" } });
    fireEvent.change(screen.getByLabelText(/country/i), { target: { value: "India" } });
    fireEvent.change(screen.getByLabelText(/^salary$/i), { target: { value: "2000000.00" } });
    fireEvent.change(screen.getByLabelText(/currency/i), { target: { value: "INR" } });
    fireEvent.change(screen.getByLabelText(/date of joining/i), { target: { value: "2021-06-01" } });

    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    expect(await screen.findByText("Grace Hopper")).toBeInTheDocument();
  });

  it("updates an employee and refreshes the list", async () => {
    render(<EmployeesPage />);

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /edit ada lovelace/i }));

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: "Augusta" } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: "Ada" } });

    fireEvent.click(screen.getByRole("button", { name: /^save$/i }));

    expect(await screen.findByText("Augusta Ada")).toBeInTheDocument();
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
  });

  it("deletes an employee and refreshes the list", async () => {
    render(<EmployeesPage />);

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /delete ada lovelace/i }));
    fireEvent.click(screen.getByRole("button", { name: /confirm delete/i }));

    await waitFor(() => {
      expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
    });
  });

  it("loads the next page of employees when Next page is clicked", async () => {
    stubTwoPageEmployeesList();

    render(<EmployeesPage />);

    await screen.findByText("Ada Lovelace");
    expect(screen.queryByText("Grace Hopper")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /next page/i }));

    expect(await screen.findByText("Grace Hopper")).toBeInTheDocument();
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
  });

  it("loads the previous page of employees when Previous page is clicked", async () => {
    stubTwoPageEmployeesList();

    render(<EmployeesPage />);

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /next page/i }));
    await screen.findByText("Grace Hopper");

    fireEvent.click(screen.getByRole("button", { name: /previous page/i }));

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.queryByText("Grace Hopper")).not.toBeInTheDocument();
  });
});
