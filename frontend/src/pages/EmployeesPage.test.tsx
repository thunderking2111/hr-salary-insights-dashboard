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
});
