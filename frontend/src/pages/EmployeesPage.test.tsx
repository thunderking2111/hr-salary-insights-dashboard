import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import type { Employee } from "../api/types";
import { sampleEmployee } from "../test/fixtures";
import { server } from "../test/server";
import { EmployeesPage } from "./EmployeesPage";

const pageTwoEmployee: Employee = {
  id: 2,
  first_name: "Grace",
  last_name: "Hopper",
  full_name: "Grace Hopper",
  email: "grace.hopper@example.com",
  job_title: "Software Engineer",
  department: "Engineering",
  employment_type: "full_time",
  country: "India",
  salary: "2000000.00",
  currency: "INR",
  date_of_joining: "2021-06-01",
  created_at: "2021-06-01T00:00:00Z",
  updated_at: "2021-06-01T00:00:00Z",
};

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
    server.use(
      http.get("/api/employees/", ({ request }) => {
        const page = new URL(request.url).searchParams.get("page") ?? "1";
        if (page === "2") {
          return HttpResponse.json({
            count: 2,
            next: null,
            previous: "/api/employees/?page=1",
            results: [pageTwoEmployee],
          });
        }
        return HttpResponse.json({
          count: 2,
          next: "/api/employees/?page=2",
          previous: null,
          results: [sampleEmployee],
        });
      }),
    );

    render(<EmployeesPage />);

    await screen.findByText("Ada Lovelace");
    expect(screen.queryByText("Grace Hopper")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /next page/i }));

    expect(await screen.findByText("Grace Hopper")).toBeInTheDocument();
    expect(screen.queryByText("Ada Lovelace")).not.toBeInTheDocument();
  });

  it("loads the previous page of employees when Previous page is clicked", async () => {
    server.use(
      http.get("/api/employees/", ({ request }) => {
        const page = new URL(request.url).searchParams.get("page") ?? "1";
        if (page === "2") {
          return HttpResponse.json({
            count: 2,
            next: null,
            previous: "/api/employees/?page=1",
            results: [pageTwoEmployee],
          });
        }
        return HttpResponse.json({
          count: 2,
          next: "/api/employees/?page=2",
          previous: null,
          results: [sampleEmployee],
        });
      }),
    );

    render(<EmployeesPage />);

    await screen.findByText("Ada Lovelace");
    fireEvent.click(screen.getByRole("button", { name: /next page/i }));
    await screen.findByText("Grace Hopper");

    fireEvent.click(screen.getByRole("button", { name: /previous page/i }));

    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.queryByText("Grace Hopper")).not.toBeInTheDocument();
  });
});
